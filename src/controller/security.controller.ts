import express, {Request, Response} from "express";
import {SecurityService} from "../service/security.service";
import {ISession} from "../types/session.interface";

const router = express.Router();
const service = new SecurityService();

router.get('/', async(req: Request, res: Response) => {
  const devices: ISession[] = await service.getAll();
  res.status(200).send(devices);
})

router.delete('/', async(req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const blog = await service.deleteAll(refreshToken);
  if(!blog) {
    return res.status(404).send();
  }
  res.status(204).send();
})

router.delete('/:id', async(req: Request, res: Response) => {
  const blog = await service.deleteOne(req.params.id);
  if(!blog) {
    return res.status(404).send();
  }
  res.status(204).send();
})

export default router;