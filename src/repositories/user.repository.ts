import { IQuery } from "../types/query.interface";
import { IUser, UserDBType } from "../types/user.types";
import { TResponseWithData } from "../types/respone-with-data.type";
import { ObjectId, WithId } from "mongodb";
import { UserModel } from "../model/user.model";
import add from "date-fns/add";

export class UserRepository {
  async getAll(
    query: IQuery,
  ): Promise<TResponseWithData<IUser[], number, "data", "totalCount">> {
    const users = await FindAllUsers(query);
    const totalCount = users.totalCount;
    const userMap = users.data.map((user) => {
      return user.accountData;
    });

    return { data: userMap, totalCount };
  }

  async getOne(search: string): Promise<UserDBType | null> {
    return UserModel.findOne({
      $or: [{ "accountData.email": search }, { "accountData.login": search }],
    });
  }

  async getOneByCode(code: string): Promise<UserDBType | null> {
    return await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }).exec();
  }

  async getOneByEmail(email: string): Promise<UserDBType | null> {
    return UserModel.findOne({ "accountData.email": email });
  }

  async findOneById(id: ObjectId | string): Promise<UserDBType | null> {
    let filter: any = {};
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    }

    if (!ObjectId.isValid(id)) {
      filter = { "accountData.id": id };
    }
    return UserModel.findOne(filter, {
      _id: 0,
    });
  }

  async create(body: UserDBType): Promise<UserDBType | null> {
    const user = await UserModel.create(body);
    return UserModel.findById(user._id, {
      "accountData.hashPassword": 0,
    }).exec();
  }

  async delete(id: string): Promise<any> {
    const { deletedCount } = await UserModel.deleteOne({
      "accountData.id": id,
    });
    return deletedCount !== 0;
  }

  async confirmUser(id: string): Promise<boolean> {
    const { matchedCount } = await UserModel.updateOne(
      { "accountData.id": id },
      { "emailConfirmation.isConfirmed": true },
    );
    return matchedCount !== 0;
  }

  async updateCode(id: string, code: string): Promise<boolean> {
    const { matchedCount } = await UserModel.updateOne(
      { "accountData.id": id },
      { "emailConfirmation.confirmationCode": code },
    );
    return matchedCount !== 0;
  }

  async changeConfirm(id: string, status: boolean): Promise<boolean> {
    const { matchedCount } = await UserModel.updateOne(
      { "accountData.id": id },
      { "emailConfirmation.isConfirmed": status },
    );
    return matchedCount !== 0;
  }

  async changeConfirmExpire(id: string): Promise<boolean> {
    const { matchedCount } = await UserModel.updateOne(
      { "accountData.id": id },
      {
        "emailConfirmation.expirationDate": add(new Date(), {
          hours: 1,
        }),
      },
    );
    return matchedCount !== 0;
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const { matchedCount } = await UserModel.updateOne(
      { "accountData.id": id },
      { "accountData.hashPassword": newPassword },
    );
    return matchedCount !== 0;
  }
}

async function FindAllUsers(
  query: IQuery,
): Promise<
  TResponseWithData<WithId<UserDBType>[], number, "data", "totalCount">
> {
  const {
    searchNameTerm,
    sortDirection,
    pageSize,
    pageNumber,
    sortBy,
    searchEmailTerm,
    searchLoginTerm,
  } = query;
  let filter: any = {};
  const sortOptions: { [key: string]: any } = {};
  sortOptions[sortBy as string] = sortDirection;
  const orConditions = [];

  if (searchNameTerm) {
    filter = { "accountData.name": { $regex: searchNameTerm, $options: "i" } };
  }

  if (searchEmailTerm) {
    orConditions.push({
      "accountData.email": { $regex: searchEmailTerm, $options: "i" },
    });
  }

  if (searchLoginTerm) {
    orConditions.push({
      "accountData.login": { $regex: searchLoginTerm, $options: "i" },
    });
  }

  if (orConditions.length > 0) {
    filter.$or = orConditions;
  }
  const total = await UserModel.countDocuments(filter).exec();
  const data = await UserModel.find(filter, { "accountData.hashPassword": 0 })
    .sort(sortOptions)
    .skip(+pageSize * (pageNumber - 1))
    .limit(+pageSize)
    .exec();

  return { data: data, totalCount: total };
}
