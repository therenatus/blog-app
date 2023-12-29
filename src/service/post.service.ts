import { PostResponseType, PostType } from "../types/post.type";
import { PostRepository } from "../repositories/post.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";
import { Document } from "mongodb";
import { TResponseWithData } from "../types/respone-with-data.type";
import { CreatePostDto } from "../controller/dto/create-post.dto";
import { injectable } from "inversify";
import { LikeBusinessLayer } from "../buisness/like.business";
import { LikeStatus } from "../types/like.type";
import { PostBusinessLayer } from "../buisness/post.business";

@injectable()
export class PostService {
  constructor(
    protected repository: PostRepository,
    protected blogRepository: BlogRepository,
    protected postBusinessLayer: PostBusinessLayer,
    protected likeBusinessLayer: LikeBusinessLayer,
  ) {}

  async getAll(
    query: any,
  ): Promise<TResponseWithData<PostType[], TMeta, "items", "meta">> {
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

  async getOne(
    id: string,
    userId: string | undefined,
  ): Promise<PostResponseType | null> {
    let user;
    if (userId) {
      user = await this.postBusinessLayer.verifyUser(userId);
    }
    if (user) {
      userId = user.id;
    }
    return await this.postBusinessLayer.findOneWithLikes(id, userId);
  }

  async create(
    body: CreatePostDto,
    id: string | null,
  ): Promise<PostType | boolean | null> {
    const date = new Date();
    if (!body.blogId && !id) {
      return false;
    }
    const blog = await this.blogRepository.findOne(id ? id : body.blogId!);
    if (!blog) {
      return false;
    }
    const newPost: PostType = {
      ...body,
      blogName: blog.name,
      createdAt: date,
      blogId: blog.id,
      id: (+date).toString(),
    };
    return await this.repository.create(newPost);
  }

  async like(postId: string, userId: string, status: LikeStatus) {
    return await this.likeBusinessLayer.prepareCommentForLike(
      postId,
      userId,
      status,
    );
  }

  async update(id: string, body: any): Promise<PostType | boolean> {
    return await this.repository.update(id, body);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
