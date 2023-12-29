import { BlogType } from "../types/blog.type";
import { BlogRepository } from "../repositories/blog.repository";
import { TResponseWithData } from "../types/respone-with-data.type";
import { Document } from "mongodb";
import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";
import { PostType } from "../types/post.type";
import { CreateBlogDto } from "../controller/dto/create-blog.dto";
import { injectable } from "inversify";
import { BlogModel } from "../model/blog.model";

@injectable()
export class BlogService {
  constructor(protected repository: BlogRepository) {}
  async getAll(
    query: any,
  ): Promise<TResponseWithData<BlogType[], TMeta, "items", "meta">> {
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

  async getOne(id: string): Promise<BlogType | null> {
    return await this.repository.findOne(id);
  }

  async create(body: CreateBlogDto): Promise<BlogType | null> {
    const blog = BlogModel.makeInstance(body);
    return this.repository.save(blog);
  }

  async findBlogsPost(
    id: string,
    query: any,
  ): Promise<TResponseWithData<PostType[], TMeta, "items", "meta"> | boolean> {
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

  async update(id: string, body: Partial<BlogType>): Promise<boolean> {
    return await this.repository.updateOne(id, body);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.deleteOne(id);
  }
}
