import {blogCollection, postCollection} from "../index";
import {IQuery} from "../types/query.interface";
import {IBlog} from "../types/blog.interface";
import {TResponseWithData} from "../types/respone-with-data.type";
import {WithId} from "mongodb";
import {FindAllWithCount} from "../helpers/findAllWithCount";
import {IPost} from "../types/post.interface";

export class BlogRepository {
  async find(query: IQuery): Promise<TResponseWithData<WithId<IBlog>[], number, 'data', 'totalCount'>> {
    return await FindAllWithCount<IBlog>(query, blogCollection, null);
  }

  async findOne(id: string): Promise<IBlog | null> {
   return await blogCollection.findOne({ id: id }, {projection: { _id: 0}});
  }

  async findBlogsPost(id: string, query: IQuery):  Promise<TResponseWithData<WithId<IPost>[], number, 'data', 'totalCount'>> {
    return await FindAllWithCount<IPost>(query, postCollection, id);
  }

  async create(body: any): Promise<IBlog | null> {
    const {insertedId} = await blogCollection.insertOne(body);
    return await blogCollection.findOne({_id: insertedId}, {projection: { _id: 0}})
  }

  async updateOne(id: string, body: any): Promise<boolean> {
    const {matchedCount} = await blogCollection.updateOne({ id }, { $set: body });
    if(matchedCount === 0){
      return false
    }
    return true
  }

  async deleteOne(id: string): Promise<boolean> {
    const { deletedCount } = await blogCollection.deleteOne({ id });
    if (deletedCount === 0) {
      return false;
    }
    return true;
  }
}