import {IPost} from "../types/post.interface";
import {PostRepository} from "../repositories/post.repository";
import {BlogRepository} from '../repositories/blog.repository'
import {QueryBuilder} from "../helpers/query-builder";
import {TMeta} from "../types/meta.type";
import {Document} from "mongodb";
import {TResponseWithData} from "../types/respone-with-data.type";
const Repository = new PostRepository();
const blogRepository = new BlogRepository();
export class PostService {

  async getAll(query: any): Promise<TResponseWithData<IPost[], TMeta, 'items', 'meta'>> {
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

  async getOne(id: string): Promise<IPost | null> {
    return await Repository.findOne(id);
  }

  async create (body: any, id: string | null): Promise<IPost | boolean | null> {
    const date = new Date();
    const blog = await blogRepository.findOne(id ? id : body.blogId);
    if(!blog){
      return false;
     }
    body.blogName = blog.name;
    body.createdAt = date;
    body.blogId = blog.id;
    body.id = id ? id : (+date).toString();
    return await Repository.create(body);
  }

  async update(id: string, body: any): Promise<IPost | boolean>{
    return await Repository.update(id, body);
  }

  async delete (id: string): Promise<boolean> {
    return await Repository.delete(id)
  }
}