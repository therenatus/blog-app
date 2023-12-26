import { UserRepository } from "../repositories/user.repository";
import {
  LoginType,
  RegistrationType,
  UserType,
  UserDBType,
} from "../types/user.types";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { generateHash } from "../helpers/hashPassword";
import { EmailManagers } from "../managers/email-managers";
import { TokenResponseType } from "../types/token-response.interface";
import { JwtService } from "../helpers/jwtService";
import { UpdatePasswordDto } from "../controller/dto/update-password.dto";
import { injectable } from "inversify";
import { UserModel } from "../model/user.model";
import { AuthBusinessLayer } from "../buisness/auth.business";
import { TokenBusinessLayer } from "../buisness/token.business";
import { SessionBusinessLayer } from "../buisness/session.business";
import { SessionType } from "../types/session.type";

@injectable()
export class AuthService {
  constructor(
    protected repository: UserRepository,
    protected emailManager: EmailManagers,
    protected jwtService: JwtService,
    protected authBusinessLayer: AuthBusinessLayer,
    protected tokenBusinessLayer: TokenBusinessLayer,
    protected sessionBusinessLayer: SessionBusinessLayer,
  ) {}

  async login(
    body: LoginType,
    ip: string,
    userAgent?: string,
  ): Promise<TokenResponseType | boolean> {
    if (!userAgent) userAgent = uuidv4();
    const deviceId: string = uuidv4();
    const user = await this.authBusinessLayer.verifyUser(body);
    if (!user) {
      return false;
    }

    const sessionData: SessionType = {
      deviceId,
      ip,
      title: userAgent,
      lastActiveDate: new Date(),
      userId: user.accountData.id,
    };
    const session = await this.sessionBusinessLayer.createSession(sessionData);
    if (!session) {
      return false;
    }
    if (!this.authBusinessLayer.comparePassword(user, body.password)) {
      return false;
    }

    return this.authBusinessLayer.generateTokens(user.accountData.id, deviceId);
  }

  async refreshToken(token: string): Promise<TokenResponseType | null> {
    const id = this.tokenBusinessLayer.verifyToken(token);
    const validToken = await this.tokenBusinessLayer.checkValidToken(token);
    if (!id || !validToken) {
      return null;
    }

    const decode = await this.jwtService.getUserByToken(token);

    const session = await this.sessionBusinessLayer.updateLastActivation(
      decode.deviceId,
      token,
    );
    if (!session) {
      return null;
    }
    return this.authBusinessLayer.generateTokens(id, decode.deviceId);
  }

  async getMe(userID: string | ObjectId): Promise<UserType | boolean> {
    const me = await this.repository.findOneById(userID);
    if (!me) {
      return false;
    }
    return me.accountData;
  }

  async registration(body: RegistrationType): Promise<UserDBType | null> {
    const { email, login, password } = body;
    const hashPassword = await generateHash(password);

    const user = UserModel.makeInstance(login, email, hashPassword);

    const createResult = await this.repository.save(user);
    await this.emailManager.sendConfirmMessages(user);
    return createResult;
  }

  async recoveryPassword(email: string): Promise<boolean> {
    const user =
      await this.authBusinessLayer.findAndUpdateUserForRecovery(email);
    if (!user) {
      return false;
    }
    await this.emailManager.sendPasswordRecoveryMessages(user);
    return true;
  }

  async setNewPassword(data: UpdatePasswordDto): Promise<boolean> {
    return this.authBusinessLayer.updatePassword(data);
  }

  async logout(token: string): Promise<boolean> {
    if (!this.tokenBusinessLayer.verifyToken(token)) {
      return false;
    }
    const validToken = await this.tokenBusinessLayer.checkValidToken(token);
    if (!validToken) {
      return false;
    }

    const decode = await this.jwtService.getUserByToken(token);

    return this.authBusinessLayer.findSessionAndLogout(token, decode.id);
  }

  async resendEmail(email: string) {
    const user = await this.authBusinessLayer.updateVerifyCode(email);
    if (!user) {
      return false;
    }
    await this.emailManager.sendConfirmMessages(user);
  }

  async confirmUser(code: string) {
    const user = await this.repository.getOneByCode(code);
    if (!user) {
      return false;
    }
    if (user.canBeConfirmed(code)) {
      user.confirm(code);
      return await this.repository.save(user);
    }
    return false;
  }
}
