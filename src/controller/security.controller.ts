import express, { Request, Response } from "express";
import { SecurityService } from "../service/security.service";
import { ISession } from "../types/session.interface";
import { WithId } from "mongodb";
import { StatusEnum } from "../types/status.enum";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const service = new SecurityService();

router.get("/", async (_: Request, res: Response) => {
  const devices: WithId<ISession>[] = await service.getAll();
  res.status(200).send(devices);
});

router.delete("/", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send();
  }
  const session = await service.deleteAll(refreshToken);
  if (!session) {
    return res.status(404).send();
  }
  res.status(204).send();
});

router.delete("/:id", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(StatusEnum.FORBIDDEN);
  }
  if (!req.params.id) {
    res.sendStatus(StatusEnum.NOT_FOUND);
  }
  const session = await service.deleteOne(req.params.id, req.userId);
  if (session === StatusEnum.NOT_FOUND) {
    return res.sendStatus(StatusEnum.NOT_FOUND);
  }
  if (session === StatusEnum.FORBIDDEN) {
    return res.status(StatusEnum.FORBIDDEN).send("ddd");
  }
  res.status(204).send();
});

export default router;
