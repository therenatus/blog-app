import { Request, Response } from "express";
import { SecurityService } from "../service/security.service";
import { ISession } from "../types/session.interface";
import { WithId } from "mongodb";
import { StatusEnum } from "../types/status.enum";
import { injectable } from "inversify";

@injectable()
export class SecurityController {
  constructor(protected service: SecurityService) {}

  async getSessions(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).send();
    }
    const devices: WithId<ISession>[] = await this.service.getAll(refreshToken);
    res.status(200).send(devices);
  }

  async deleteAllSessions(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).send();
    }
    const session = await this.service.deleteAll(refreshToken);
    if (!session) {
      return res.status(404).send();
    }
    res.status(204).send();
  }

  async deleteSession(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(StatusEnum.UNAUTHORIZED);
    }
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const session = await this.service.deleteOne(req.params.id, refreshToken);
    if (session === StatusEnum.NOT_FOUND) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    if (session === StatusEnum.FORBIDDEN) {
      return res.status(StatusEnum.FORBIDDEN).send();
    }
    res.status(204).send();
  }
}
