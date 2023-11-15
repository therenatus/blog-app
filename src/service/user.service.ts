import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";
import { UserRepository } from "../repositories/user.repository";
import { TResponseWithData } from "../types/respone-with-data.type";
import { IUser, UserDBType } from "../types/user.types";
import { generateHash } from "../helpers/hashPassword";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { IQuery } from "../types/query.interface";
import { CreateUserDto } from "../controller/dto/create-user.dto";

const Repository = new UserRepository();
export class UserService {
  async getAll(
    query: IQuery,
  ): Promise<TResponseWithData<IUser[], TMeta, "items", "meta">> {
    const querySearch = QueryBuilder(query);
    const meta: TMeta = {
      ...querySearch,
      totalCount: 0,
    };
    const { data, totalCount } = await Repository.getAll(querySearch);
    meta.totalCount = totalCount;
    return { items: data, meta: meta };
  }

  async create(body: CreateUserDto): Promise<IUser | null> {
    const hashPassword = await generateHash(body.password);
    const user: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        id: (+new Date()).toString(),
        hashPassword,
        email: body.email,
        login: body.login,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
    };
    const newUserId = await Repository.create(user);
    if (!newUserId) return null;
    const newUser = await Repository.findOneById(newUserId);
    if (!newUser) return null;
    return newUser.accountData;
  }

  async delete(id: string): Promise<boolean> {
    return await Repository.delete(id);
  }

  async getOne(id: string): Promise<UserDBType | null> {
    return await Repository.getOne(id);
  }
}
