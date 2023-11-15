import express, { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { IPaginationResponse } from "../types/pagination-response.interface";
import { IUser } from "../types/user.types";
import { CreateUserValidator } from "./validator/create-user.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import * as os from "os";
import { RequestType } from "../types/request.type";
import { IQuery } from "../types/query.interface";
import { StatusEnum } from "../types/status.enum";
import { CreateUserDto } from "./dto/create-user.dto";

const router = express.Router();
const service = new UserService();

router.get(
  "/",
  async (
    req: RequestType<null, null, IQuery>,
    res: Response<IPaginationResponse<IUser[]>>,
  ) => {
    const { items, meta } = await service.getAll(req.query);
    const users: IPaginationResponse<IUser[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    res.status(StatusEnum.SUCCESS).send(users);
  },
);

router.post(
  "/",
  CreateUserValidator,
  InputValidationMiddleware,
  async (req: RequestType<any, CreateUserDto>, res: Response<IUser>) => {
    const user = await service.create(req.body);
    if (!user) {
      return res.sendStatus(StatusEnum.INTERNAL_SERVER);
    }
    res.status(StatusEnum.CREATED).send(user);
  },
);

router.get("/:id", async (req: RequestType<{ id: string }>, res: Response) => {
  const data = await service.getOne(req.params.id);
  if (!data) {
    return res.sendStatus(StatusEnum.NOT_FOUND);
  }
  res.sendStatus(StatusEnum.NOT_CONTENT);
});
router.delete(
  "/:id",
  async (req: RequestType<{ id: string }>, res: Response) => {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const data = await service.delete(req.params.id);
    if (!data) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  },
);

export default router;
