import { UserService } from "../service/user.service";
import { RequestType } from "../types/request.type";
import { IQuery } from "../types/query.interface";
import { Response } from "express";
import { IPaginationResponse } from "../types/pagination-response.interface";
import { IUser } from "../types/user.types";
import { StatusEnum } from "../types/status.enum";
import { CreateUserDto } from "./dto/create-user.dto";

export class UserController {
  constructor(public service: UserService) {}
  async getUsers(
    req: RequestType<null, null, IQuery>,
    res: Response<IPaginationResponse<IUser[]>>,
  ) {
    const { items, meta } = await this.service.getAll(req.query);
    const users: IPaginationResponse<IUser[]> = {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
    res.status(StatusEnum.SUCCESS).send(users);
  }

  async createUser(req: RequestType<any, CreateUserDto>, res: Response<IUser>) {
    const user = await this.service.create(req.body);
    if (!user) {
      return res.sendStatus(StatusEnum.INTERNAL_SERVER);
    }
    res.status(StatusEnum.CREATED).send(user);
  }

  async getUser(req: RequestType<{ id: string }>, res: Response) {
    const data = await this.service.getOne(req.params.id);
    if (!data) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  }

  async deleteUser(req: RequestType<{ id: string }>, res: Response) {
    if (!req.params.id) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    const data = await this.service.delete(req.params.id);
    if (!data) {
      return res.sendStatus(StatusEnum.NOT_FOUND);
    }
    res.sendStatus(StatusEnum.NOT_CONTENT);
  }
}
