import { SessionRepository } from "../repositories/session.repository";
import { SessionType } from "../types/session.type";
import { TokenRepository } from "../repositories/token.repository";
import { injectable } from "inversify";

@injectable()
export class SessionBusinessLayer {
  constructor(
    protected sessionRepository: SessionRepository,
    protected tokenRepository: TokenRepository,
  ) {}

  async createSession(data: SessionType) {
    return await this.sessionRepository.login(data);
  }

  async updateLastActivation(id: string, token: string) {
    const session = await this.sessionRepository.findOne(id);
    if (!session) {
      return false;
    }
    session.lastActiveDate = new Date();
    await this.sessionRepository.save(session);
    await this.tokenRepository.addToBlackList(token);
    return true;
  }
}
