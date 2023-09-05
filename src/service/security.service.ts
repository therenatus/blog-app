import {SessionRepository} from "../repositories/session.repository";
import {ISession} from "../types/session.interface";
import {JwtService} from "../helpers/jwtService";

const repository = new SessionRepository();
const jwtService = new JwtService();

export class SecurityService {

  async getAll(): Promise<ISession[]>{
    return await repository.getAll();
  }

  async deleteOne(deviceId: string): Promise<boolean>{
    return await repository.deleteOne(deviceId)
  }

  async deleteAll(token: string): Promise<boolean>{
    const decode = await jwtService.getUserByToken(token);
    return await repository.deleteAll(decode.deviceId);
  }
}