import express, { Request, Response } from "express";
import { SecurityService } from "../service/security.service";
import { ISession } from "../types/session.interface";
import { WithId } from "mongodb";
import { StatusEnum } from "../types/status.enum";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const service = new SecurityService();

router.get("/", async (req: Request, res: Response) => {
  let devices: WithId<ISession>[];
  if (req.headers.authorization) {
    devices = await service.getAll();
  } else {
    devices = [];
  }

  res.status(200).send(devices);
});

router.delete("/", AuthMiddleware, async (req: Request, res: Response) => {
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

router.delete("/:id", AuthMiddleware, async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const session = await service.deleteOne(req.params.id, req.userId);
  if (session === StatusEnum.NOT_FOUND) {
    return res.sendStatus(StatusEnum.NOT_FOUND);
  }
  if (session === StatusEnum.UNAUTHORIZED) {
    return res.sendStatus(StatusEnum.UNAUTHORIZED);
  }
  res.status(204).send();
});

export default router;
