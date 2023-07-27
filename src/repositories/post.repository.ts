import { postCollection } from "../index";
import {IQuery} from "../types/query.interface";
import {TResponseWithData} from "../types/respone-with-data.type";
import {FindAllWithCount} from "../helpers/findAllWithCount";
import {IPost} from "../types/post.interface";
import {ObjectId, WithId} from "mongodb";

export class PostRepository {
  async find(query: IQuery): Promise<TResponseWithData<WithId<IPost>[], number, 'data', 'totalCount'>> {
    return await FindAllWithCount<IPost>(query, postCollection, null)
  }

  async findOne(id: string | ObjectId): Promise<IPost | null> {
    let findBy: any
    ObjectId.isValid(id) ? findBy = {_id: new ObjectId(id)} : findBy = { id };
    return await postCollection.findOne(findBy, {projection: { _id: 0}});
  }

  async create(body: any): Promise<IPost | null> {
    const { insertedId } = await postCollection.insertOne(body);
    return await postCollection.findOne({_id: insertedId}, {projection: { _id: 0}})
  }

  async update(id: string, body: any): Promise<IPost | boolean> {
    const res = await postCollection.findOneAndUpdate({id}, {$set: body}, {returnDocument: 'after'});
    if(!res.ok){
      return false;
    }
    return res.value as IPost;
  }

  async delete(id: string): Promise<boolean> {
    const { deletedCount } = await postCollection.deleteOne({id});
    if(deletedCount === 0){
      return false
    }
    return true
  }
}