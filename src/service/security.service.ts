import { SessionRepository } from "../repositories/session.repository";
import { ISession } from "../types/session.interface";
import { JwtService } from "../helpers/jwtService";
import { WithId } from "mongodb";
import { StatusEnum } from "../types/status.enum";

const repository = new SessionRepository();
const jwtService = new JwtService();

export class SecurityService {
  async getAll(token: string): Promise<WithId<ISession>[]> {
    const decode = await jwtService.getUserByToken(token);
    return await repository.getAll(decode.id);
  }

  async deleteOne(deviceId: string, token: string): Promise<StatusEnum> {
    const data = await repository.findOne(deviceId);
    if (!data) {
      return StatusEnum.NOT_FOUND;
    }
    const decode = await jwtService.getUserByToken(token);
    if (data.userId != decode.id) {
      return StatusEnum.FORBIDDEN;
    }
    const deleted = await repository.deleteOne(deviceId);
    return deleted ? StatusEnum.NOT_CONTENT : StatusEnum.NOT_FOUND;
  }

  async deleteAll(token: string): Promise<boolean> {
    const decode = await jwtService.getUserByToken(token);
    return await repository.deleteAll(decode);
  }
}
