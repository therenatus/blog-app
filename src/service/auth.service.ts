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
import { sessionCollection } from "../index";

const Repository = new UserRepository();
const emailManager = new EmailManagers();
const jwtService = new JwtService();
const tokenRepository = new TokenRepository();
const sessionRepository = new SessionRepository();
export class AuthService {
  async login(
    body: ILogin,
    ip: string,
    userAgent: string,
  ): Promise<ITokenResponse | boolean> {
    const deviceId: string = uuidv4();
    const user = await Repository.getOne(body.loginOrEmail);
    if (!user) {
      return false;
    }
    // const usedIp = await sessionRepository.getSessionById(ip);
    // if (usedIp) {
    //   await sessionRepository.updateByIP(deviceId, ip, userAgent);
    // } else {
    //
    // }
    const session = await sessionRepository.login({
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
    return await _generateTokens(user.accountData.id, deviceId);
  }

  async refreshToken(token: string): Promise<ITokenResponse | null> {
    const id = CheckToken(token);
    const d = await jwtService.getUserByToken(token);
    const validToken = await tokenRepository.checkFromBlackList(token);
    if (!id || !validToken) {
      return null;
    }
    await sessionRepository.updateLastActive(d.deviceId);
    await tokenRepository.addToBlackList(token);
    return await _generateTokens(id, d.deviceId);
  }

  async getMe(userID: string | ObjectId): Promise<IUser | boolean> {
    const me = await Repository.findOneById(userID);
    if (!me) {
      return false;
    }
    return me.accountData;
  }

  async registration(body: IRegistration) {
    const { email, login, password } = body;
    const hashPassword = await generateHash(password);
    const user: UserDBType = {
      _id: new ObjectId(),
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

    const createResult = Repository.create(user);
    await emailManager.sendConfirmMessages(user);
    return createResult;
  }

  async logout(token: string, accessToken: string): Promise<boolean> {
    if (!CheckToken(token) && !CheckToken(accessToken)) {
      return false;
    }
    const decode = await jwtService.getUserByToken(accessToken);
    const validToken = await tokenRepository.checkFromBlackList(token);
    if (!validToken) {
      return false;
    }
    await tokenRepository.addToBlackList(token);
    await sessionRepository.deleteOne(decode.deviceId);
    return true;
  }
  async resendEmail(email: string) {
    const user = await Repository.getOneByEmail(email);
    const code = uuidv4();
    if (!user) {
      return null;
    }
    await Repository.updateCode(user.accountData.id, code);
    const userWithNewCode = await Repository.getOneByEmail(email);
    await emailManager.sendConfirmMessages(userWithNewCode!);
  }

  async confirmUser(code: string) {
    const user = await Repository.getOneByCode(code);
    return await Repository.confirmUser(user!.accountData.id);
  }
}

const _generateTokens = async (
  id: string,
  deviceId?: string,
): Promise<ITokenResponse> => {
  const accessToken = await jwtService.generateJwt(id, "30s");
  const refreshToken = await jwtService.generateJwt(
    id,
    "20m",
    deviceId ? deviceId : undefined,
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};
