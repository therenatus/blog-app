import { IBlog } from "../types/blog.interface";
import { BlogRepository } from "../repositories/blog.repository";
import { TResponseWithData } from "../types/respone-with-data.type";
import { Document } from "mongodb";
import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";
import { IPost } from "../types/post.interface";
import { CreateBlogDto } from "../controller/dto/create-blog.dto";

export class BlogService {
  constructor(protected repository: BlogRepository) {}

  async getAll(
    query: any,
  ): Promise<TResponseWithData<IBlog[], TMeta, "items", "meta">> {
    const querySearch = QueryBuilder(query);
    const meta: TMeta = {
      ...querySearch,
      totalCount: 0,
    };
    const { data, totalCount } = await this.repository.find(querySearch);
    meta.totalCount = totalCount;
    data.map((blog: Document) => {
      delete blog._id;
    });
    return { items: data, meta: meta };
  }

  async getOne(id: string): Promise<IBlog | null> {
    return await this.repository.findOne(id);
  }

  async create(body: CreateBlogDto): Promise<IBlog | null> {
    const date = new Date();
    const newBlog: IBlog = {
      ...body,
      createdAt: date,
      id: (+date).toString(),
      isMembership: false,
    };
    return await this.repository.create(newBlog);
  }

  async findBlogsPost(
    id: string,
    query: any,
  ): Promise<TResponseWithData<IPost[], TMeta, "items", "meta"> | boolean> {
    const querySearch = QueryBuilder(query);
    const meta: TMeta = {
      ...querySearch,
      totalCount: 0,
    };
    const blog = await this.getOne(id);
    if (!blog) {
      return false;
    }
    const { data, totalCount } = await this.repository.findBlogsPost(
      blog.id,
      querySearch,
    );
    meta.totalCount = totalCount;
    data.map((post: Document) => {
      delete post._id;
    });
    return { items: data, meta: meta };
  }

  async update(id: string, body: Partial<IBlog>): Promise<boolean> {
    return await this.repository.updateOne(id, body);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.deleteOne(id);
  }
}
