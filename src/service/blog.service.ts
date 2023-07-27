import {IBlog} from "../types/blog.interface";
import {IQuery} from "../types/query.interface";
import {BlogRepository} from "../repositories/blog.repository";
import {TResponseWithData} from "../types/respone-with-data.type";
import {Document} from "mongodb";
import {QueryBuilder} from "../helpers/query-builder";
import {TMeta} from "../types/meta.type";
import {IPost} from "../types/post.interface";

const Repository = new BlogRepository()
export class BlogService {

  async getAll(query: any): Promise<TResponseWithData<IBlog[], TMeta, 'items', 'meta'>> {
    const querySearch = QueryBuilder(query);
    const meta: TMeta = {
      ...querySearch,
      totalCount: 0
    };
    const {data, totalCount} = await Repository.find(querySearch);
    meta.totalCount = totalCount;
    data.map((blog: Document) => {
      delete blog._id
    })
    return { items: data, meta: meta }
  }
  async getOne(id: string): Promise<IBlog | null> {
    return await Repository.findOne(id);
  }
  async create (body: any): Promise<IBlog | null>{
    const date = new Date();
    body.createdAt = date;
    body.id = (+date).toString();
    body.isMembership = false;
    return await Repository.create(body);
  }

  async findBlogsPost (id: string, query: any): Promise<TResponseWithData<IPost[], TMeta, 'items', 'meta'> | boolean> {
    const querySearch = QueryBuilder(query);
    const meta: TMeta = {
      ...querySearch,
      totalCount: 0
    };
    const blog = await this.getOne(id);
    if(!blog) {
      return false
    }
    const {data, totalCount} = await Repository.findBlogsPost(blog.id, querySearch);
    meta.totalCount = totalCount;
    data.map((post: Document) => {
      delete post._id
    })
    return { items: data, meta: meta }
  }

  async update(id: string, body: any): Promise<boolean>{
    return await Repository.updateOne(id, body);
  }
  async delete (id: string): Promise<boolean> {
    return await Repository.deleteOne(id);
  }
}