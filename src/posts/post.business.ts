import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostResponseType } from './types/post.type';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogRepository } from '../blogs/blog.repository';
import { deleteIDandV } from '../helpers/simplefy';

@Injectable()
export class PostBusinessLayer {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}

  async createPost(dto: CreatePostDto) {
    const blog = await this.blogRepository.getOneBlog(dto.blogId);
    if (!blog) {
      return null;
    }

    const postInstance = { ...dto, blogName: blog.name };
    const post = this.PostModel.makeInstance(postInstance);
    const createdPost = await post.save();
    const simplePost = deleteIDandV(createdPost);
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    return {
      ...simplePost,
      extendedLikesInfo: likesInfo,
    };
  }

  async updatePost(
    id: string,
    dto: CreatePostDto,
  ): Promise<PostDocument | null> {
    const post = await this.postRepository.getOnePost(id);
    if (!post) {
      return null;
    }
    Object.assign(post, dto);
    const newPost = await post.save();
    return deleteIDandV(newPost);
  }

  async getPostWithLikes(id: string): Promise<PostResponseType | null> {
    const post = await this.postRepository.getOnePost(id);
    if (!post) {
      return null;
    }
    const simplePost = deleteIDandV(post);
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    return {
      ...simplePost,
      extendedLikesInfo: likesInfo,
    };
  }
}
