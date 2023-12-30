import { PostResponseType, PostType } from "../types/post.type";
import { PostRepository } from "../repositories/post.repository";
import { BlogRepository } from "../repositories/blog.repository";
import { CreatePostDto } from "../controller/dto/create-post.dto";
import { injectable } from "inversify";
import { LikeBusinessLayer } from "../buisness/like.business";
import { LikeStatus, LikeType } from "../types/like.type";
import { PostBusinessLayer } from "../buisness/post.business";
import { IPaginationResponse } from "../types/pagination-response.interface";

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
    auth: string | undefined,
  ): Promise<IPaginationResponse<PostResponseType[]>> {
    const querySearch = this.postBusinessLayer.queryBuilder(query);
    const { data, totalCount } = await this.postBusinessLayer.findAllWithLikes(
      querySearch,
      auth,
    );
    const meta = this.postBusinessLayer.metaData(querySearch, totalCount);
    return this.postBusinessLayer.postResponseMapping(data, meta);
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
    auth: string | undefined,
  ): Promise<PostResponseType | boolean | null> {
    let user;
    if (auth) {
      user = await this.postBusinessLayer.verifyUser(auth);
    }
    if (user) {
      auth = user.id;
    }
    if (!body.blogId && !id) {
      return false;
    }
    const blog = await this.blogRepository.findOne(id ? id : body.blogId!);
    if (!blog) {
      return false;
    }
    const post = await this.postBusinessLayer.createPost(body, blog);
    return this.postBusinessLayer.findOneWithLikes(post.id, auth);
  }

  async like(
    postId: string,
    userId: string,
    status: LikeStatus,
  ): Promise<LikeType | null | false> {
    const post = await this.repository.findOne(postId);
    if (!post) {
      return false;
    }
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
