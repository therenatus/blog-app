import { TokenResponseType } from "../types/token-response.interface";
import { UserRepository } from "../repositories/user.repository";
import { EmailManagers } from "../managers/email-managers";
import { JwtService } from "../helpers/jwtService";
import { TokenRepository } from "../repositories/token.repository";
import { SessionRepository } from "../repositories/session.repository";
import { LoginType, UserDBMethodsType, UserDBType } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";
import add from "date-fns/add";
import { generateHash } from "../helpers/hashPassword";
import { UpdatePasswordDto } from "../controller/dto/update-password.dto";

@injectable()
export class AuthBusinessLayer {
  constructor(
    protected repository: UserRepository,
    protected emailManager: EmailManagers,
    protected jwtService: JwtService,
    protected tokenRepository: TokenRepository,
    protected sessionRepository: SessionRepository,
  ) {}

  async verifyUser(
    body: LoginType,
  ): Promise<HydratedDocument<UserDBType, UserDBMethodsType> | null> {
    const user = await this.repository.getOne(body.loginOrEmail);
    // if (!user || !user.confirmStatus()) {
    //   return null;
    // }
    if (!user) {
      return null;
    }
    return user;
  }

  async findAndUpdateUserForRecovery(
    email: string,
  ): Promise<UserDBType | null> {
    const user = await this.repository.getOne(email);
    if (!user) return null;

    user.emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
      }),
      isConfirmed: false,
    };
    return await this.repository.save(user);
  }

  async updatePassword(data: UpdatePasswordDto) {
    const { newPassword, recoveryCode } = data;
    const user = await this.repository.getOneByCode(recoveryCode);
    if (!user || !user.canBeConfirmed(recoveryCode)) {
      return false;
    }

    user.confirm(recoveryCode);
    user.accountData.hashPassword = await generateHash(newPassword);
    await this.repository.save(user);
    return true;
  }

  async findSessionAndLogout(token: string, id: string) {
    const session = await this.sessionRepository.findOne(id);
    if (!session) {
      return false;
    }
    await this.tokenRepository.addToBlackList(token);
    await this.sessionRepository.deleteOne(id);
    return true;
  }

  async updateVerifyCode(email: string): Promise<UserDBType | null> {
    const user = await this.repository.getOneByEmail(email);
    if (!user) {
      return null;
    }

    user.emailConfirmation.confirmationCode = uuidv4();
    return await this.repository.save(user);
  }

  comparePassword(
    user: HydratedDocument<UserDBType, UserDBMethodsType>,
    password: string,
  ) {
    if (!user.comparePassword(password)) {
      return false;
    }
    return true;
  }

  async generateTokens(
    id: string,
    deviceId?: string,
  ): Promise<TokenResponseType> {
    const accessToken = await this.jwtService.generateJwt(id, "10m");
    const refreshToken = await this.jwtService.generateJwt(
      id,
      "30m",
      deviceId ? deviceId : undefined,
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
