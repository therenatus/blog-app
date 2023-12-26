import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";
import { UserRepository } from "../repositories/user.repository";
import { TResponseWithData } from "../types/respone-with-data.type";
import { UserType, UserDBType } from "../types/user.types";
import { generateHash } from "../helpers/hashPassword";
import { IQuery } from "../types/query.interface";
import { CreateUserDto } from "../controller/dto/create-user.dto";
import { injectable } from "inversify";
import { UserModel } from "../model/user.model";

@injectable()
export class UserService {
  constructor(protected repository: UserRepository) {}
  async getAll(
    query: IQuery,
  ): Promise<TResponseWithData<UserType[], TMeta, "items", "meta">> {
    const querySearch = QueryBuilder(query);
    const meta: TMeta = {
      ...querySearch,
      totalCount: 0,
    };
    const { data, totalCount } = await this.repository.getAll(querySearch);
    meta.totalCount = totalCount;
    return { items: data, meta: meta };
  }

  async create(body: CreateUserDto): Promise<UserType | null> {
    const { email, login, password } = body;
    const hashPassword = await generateHash(password);
    const user = UserModel.makeInstance(login, email, hashPassword);

    const createResult = await this.repository.save(user);
    if (!user) return null;
    return createResult.accountData;
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async getOne(id: string): Promise<UserDBType | null> {
    return this.repository.getOne(id);
  }
}
