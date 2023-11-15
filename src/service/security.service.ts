import { SessionRepository } from "../repositories/session.repository";
import { ISession } from "../types/session.interface";
import { JwtService } from "../helpers/jwtService";
import { WithId } from "mongodb";
import { StatusEnum } from "../types/status.enum";

const repository = new SessionRepository();
const jwtService = new JwtService();

export class SecurityService {
  async getAll(): Promise<WithId<ISession>[]> {
    return await repository.getAll();
  }

  async deleteOne(
    deviceId: string,
    userId: string | null,
  ): Promise<StatusEnum> {
    const data = await repository.findOne(deviceId);
    if (userId && data?.userId === userId) {
      const deleted = await repository.deleteOne(deviceId);
      return deleted ? StatusEnum.NOT_CONTENT : StatusEnum.NOT_FOUND;
    }
    return StatusEnum.FORBIDDEN;
  }

  async deleteAll(token: string): Promise<boolean> {
    const decode = await jwtService.getUserByToken(token);
    return await repository.deleteAll(decode);
  }
}
