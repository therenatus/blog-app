import {IQuery} from "../types/query.interface";
import {FindAllWithCount} from "../helpers/findAllWithCount";
import {userCollection} from "../index";
import {IUser, UserDBType} from "../types/user.types";
import {TResponseWithData} from "../types/respone-with-data.type";
import {ObjectId, WithId} from "mongodb";

export class UserRepository {

  async getAll(query: IQuery): Promise<TResponseWithData<IUser[], number, 'data', 'totalCount'>> {
    const users = await FindAllWithCount<UserDBType>(query, userCollection, null);
    const totalCount = users.totalCount;
    const userMap = users.data.map((user) => {
      return user.accountData
    });

    return {data: userMap, totalCount}
  }

  async getOne(search: string): Promise<UserDBType | null> {
    return userCollection.findOne({$or: [{'accountData.email': search}, {'accountData.login': search}]}, {projection: {hashPassword: 0}});
  }

  async getOneByCode(code: string): Promise<UserDBType | null> {
    return userCollection.findOne({'emailConfirmation.confirmationCode': code});
  }

  async getOneByEmail(email: string): Promise<UserDBType | null> {
    return userCollection.findOne({'accountData.email': email});
  }

  async findOneById(id: ObjectId | string): Promise<UserDBType | null> {
    let filter: any = {}
    if(ObjectId.isValid(id)){
      filter = {_id: new ObjectId(id)}
    }

    if(!ObjectId.isValid(id)){
      filter = {'accountData.id': id}
    }
    return await userCollection.findOne(filter, {projection: { _id: 0, 'accountData.hashPassword': 0}});
  }
  async  create(body: UserDBType): Promise<ObjectId> {
    const { insertedId } = await userCollection.insertOne(body);
    return insertedId;
  }

  async delete(id: string): Promise<boolean> {
    const { deletedCount } = await userCollection.deleteOne({id});
    if(deletedCount === 0){
      return false
    }
    return true;
  }

  async confirmUser(id: string): Promise<boolean> {
    const { matchedCount } = await userCollection.updateOne({'accountData.id': id}, {$set : {'emailConfirmation.isConfirmed': true}});
    if(matchedCount === 0){
      return false;
    }
    return true;
  }

  async updateCode(id: string, code: string): Promise<boolean> {
    const { matchedCount } = await userCollection.updateOne({'accountData.id': id}, {$set : {'emailConfirmation.confirmationCode': code}});
    if(matchedCount === 0){
      return false;
    }
    return true;
  }

}