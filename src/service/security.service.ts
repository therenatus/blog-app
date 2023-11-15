import { SessionRepository } from "../repositories/session.repository";
import { ISession, SessionResponseType } from "../types/session.interface";
import { JwtService } from "../helpers/jwtService";
import { WithId } from "mongodb";

const repository = new SessionRepository();
const jwtService = new JwtService();

export class SecurityService {
  async getAll(): Promise<WithId<ISession>[]> {
    return await repository.getAll();
  }

  async deleteOne(deviceId: string): Promise<boolean> {
    return await repository.deleteOne(deviceId);
  }

  async deleteAll(token: string): Promise<boolean> {
    const decode = await jwtService.getUserByToken(token);
    return await repository.deleteAll(decode);
  }
}
