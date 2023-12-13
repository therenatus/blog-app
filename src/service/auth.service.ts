import { UserRepository } from "../repositories/user.repository";
import { compare } from "bcrypt";
import { ILogin, IRegistration, IUser, UserDBType } from "../types/user.types";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { generateHash } from "../helpers/hashPassword";
import { EmailManagers } from "../managers/email-managers";
import { ITokenResponse } from "../types/token-response.interface";
import { JwtService } from "../helpers/jwtService";
import { CheckToken } from "../helpers/check-token";
import { TokenRepository } from "../repositories/token.repository";
import { SessionRepository } from "../repositories/session.repository";
import { UpdatePasswordDto } from "../controller/dto/update-password.dto";

export class AuthService {
  constructor(
    protected repository: UserRepository,
    protected emailManager: EmailManagers,
    protected jwtService: JwtService,
    protected tokenRepository: TokenRepository,
    protected sessionRepository: SessionRepository,
  ) {}
  async login(
    body: ILogin,
    ip: string,
    userAgent: string,
  ): Promise<ITokenResponse | boolean> {
    const deviceId: string = uuidv4();
    const user = await this.repository.getOne(body.loginOrEmail);
    if (!user || !user.emailConfirmation.isConfirmed) {
      return false;
    }
    const session = await this.sessionRepository.login({
      deviceId,
      ip,
      title: userAgent,
      lastActiveDate: new Date(),
      userId: user.accountData.id,
    });
    if (!session) {
      return false;
    }
    const validPassword = await compare(
      body.password,
      user.accountData.hashPassword,
    );
    if (!validPassword) {
      return false;
    }
    return await this._generateTokens(user.accountData.id, deviceId);
  }

  async refreshToken(token: string): Promise<ITokenResponse | null> {
    const id = CheckToken(token);
    const decode = await this.jwtService.getUserByToken(token);
    const validToken = await this.tokenRepository.checkFromBlackList(token);
    if (!id || !validToken) {
      return null;
    }
    const isCanRefresh = await this.sessionRepository.findOne(decode.deviceId);
    if (!isCanRefresh) {
      return null;
    }
    await this.sessionRepository.updateLastActive(decode.deviceId);
    await this.tokenRepository.addToBlackList(token);
    return await this._generateTokens(id, decode.deviceId);
  }

  async getMe(userID: string | ObjectId): Promise<IUser | boolean> {
    const me = await this.repository.findOneById(userID);
    if (!me) {
      return false;
    }
    return me.accountData;
  }

  async registration(body: IRegistration): Promise<UserDBType | null> {
    const { email, login, password } = body;
    const hashPassword = await generateHash(password);
    const user: UserDBType = {
      accountData: {
        id: (+new Date()).toString(),
        login,
        email,
        hashPassword,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };

    const createResult = this.repository.create(user);
    await this.emailManager.sendConfirmMessages(user);
    return createResult;
  }

  async recoveryPassword(mail: string): Promise<boolean> {
    const user = await this.repository.getOne(mail);
    if (!user) return false;
    const code = uuidv4();
    await this.repository.updateCode(user.accountData.id, code);
    await this.repository.changeConfirm(user.accountData.id, false);
    await this.repository.changeConfirmExpire(user.accountData.id);
    const user2 = await this.repository.getOne(mail);
    await this.emailManager.sendPasswordRecoveryMessages(user2!);
    return true;
  }

  async setNewPassword(data: UpdatePasswordDto): Promise<boolean> {
    const user = await this.repository.getOneByCode(data.recoveryCode);
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    const hashPassword = await generateHash(data.newPassword);

    await this.repository.changeConfirm(user.accountData.id, true);
    return await this.repository.updatePassword(
      user.accountData.id,
      hashPassword,
    );
  }

  async logout(token: string): Promise<boolean> {
    if (!CheckToken(token)) {
      return false;
    }
    const decode = await this.jwtService.getUserByToken(token);
    const validToken = await this.tokenRepository.checkFromBlackList(token);
    if (!validToken) {
      return false;
    }
    const isCanLogout = await this.sessionRepository.findOne(decode.deviceId);
    if (!isCanLogout) {
      return false;
    }
    await this.tokenRepository.addToBlackList(token);
    await this.sessionRepository.deleteOne(decode.deviceId);
    return true;
  }
  async resendEmail(email: string) {
    const user = await this.repository.getOneByEmail(email);
    const code = uuidv4();
    if (!user) {
      return null;
    }
    await this.repository.updateCode(user.accountData.id, code);
    const userWithNewCode = await this.repository.getOneByEmail(email);
    await this.emailManager.sendConfirmMessages(userWithNewCode!);
  }

  async confirmUser(code: string) {
    const user = await this.repository.getOneByCode(code);
    return await this.repository.confirmUser(user!.accountData.id);
  }

  private async _generateTokens(
    id: string,
    deviceId?: string,
  ): Promise<ITokenResponse> {
    const accessToken = await this.jwtService.generateJwt(id, "30s");
    const refreshToken = await this.jwtService.generateJwt(
      id,
      "20m",
      deviceId ? deviceId : undefined,
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
