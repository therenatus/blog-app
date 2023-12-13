import { SessionRepository } from "../repositories/session.repository";
import { ISession } from "../types/session.interface";
import { JwtService } from "../helpers/jwtService";
import { WithId } from "mongodb";
import { StatusEnum } from "../types/status.enum";

export class SecurityService {
  constructor(
    protected repository: SessionRepository,
    protected jwtService: JwtService,
  ) {}
  async getAll(token: string): Promise<WithId<ISession>[]> {
    const decode = await this.jwtService.getUserByToken(token);
    return await this.repository.getAll(decode.id);
  }

  async deleteOne(deviceId: string, token: string): Promise<StatusEnum> {
    const data = await this.repository.findOne(deviceId);
    if (!data) {
      return StatusEnum.NOT_FOUND;
    }
    const decode = await this.jwtService.getUserByToken(token);
    if (data.userId != decode.id) {
      return StatusEnum.FORBIDDEN;
    }
    const deleted = await this.repository.deleteOne(deviceId);
    return deleted ? StatusEnum.NOT_CONTENT : StatusEnum.NOT_FOUND;
  }

  async deleteAll(token: string): Promise<boolean> {
    const decode = await this.jwtService.getUserByToken(token);
    return await this.repository.deleteAll(decode);
  }
}
