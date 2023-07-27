import express, { Request, Response} from "express";
import {UserService} from "../service/user.service";
import {IPaginationResponse} from "../types/pagination-response.interface";
import {IUser} from "../types/user.types";
import {CreateUserValidator} from "./validator/create-user.validator";
import {InputValidationMiddleware} from "../middleware/inputValidationMiddleware";

const router = express.Router();
const service = new UserService();

router.get('/', async(req: Request, res: Response) => {
  const {items, meta} = await service.getAll(req.query);
  const users: IPaginationResponse<IUser[]>= {
    pageSize: meta.pageSize,
    page: meta.pageNumber,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: items
  }
  res.status(200).send(users);
});
router.post('/', CreateUserValidator, InputValidationMiddleware, async(req: Request, res: Response) => {
  const user = await service.create(req.body);
  if(!user){
    return res.status(500).send('error')
  }
  res.status(201).send(user);
});
router.delete('/:id', async(req: Request, res: Response) => {
  const data = await service.delete(req.params.id);
  if(!data){
    return res.status(404).send()
  }
  res.status(204).send()
});

export default router;