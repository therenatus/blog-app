import { IPost } from "../types/post.interface";
import { PostRepository } from "../repositories/post.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";
import { Document } from "mongodb";
import { TResponseWithData } from "../types/respone-with-data.type";
import { CreatePostDto } from "../controller/dto/create-post.dto";
import { injectable } from "inversify";

@injectable()
export class PostService {
  constructor(
    protected repository: PostRepository,
    protected blogRepository: BlogRepository,
  ) {}

  async getAll(
    query: any,
  ): Promise<TResponseWithData<IPost[], TMeta, "items", "meta">> {
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

  async getOne(id: string): Promise<IPost | null> {
    return await this.repository.findOne(id);
  }

  async create(
    body: CreatePostDto,
    id: string | null,
  ): Promise<IPost | boolean | null> {
    const date = new Date();
    if (!body.blogId && !id) {
      return false;
    }
    const blog = await this.blogRepository.findOne(id ? id : body.blogId!);
    if (!blog) {
      return false;
    }
    const newPost: IPost = {
      ...body,
      blogName: blog.name,
      createdAt: date,
      blogId: blog.id,
      id: (+date).toString(),
    };
    return await this.repository.create(newPost);
  }

  async update(id: string, body: any): Promise<IPost | boolean> {
    return await this.repository.update(id, body);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
