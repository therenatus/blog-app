import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostResponseType } from './types/post.type';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogRepository } from '../blogs/blog.repository';

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

    return this.postRepository.save(post);
  }

  async updatePost(
    id: string,
    dto: CreatePostDto,
  ): Promise<PostDocument | null> {
    const blog = await this.postRepository.getOnePost(id);
    if (!blog) {
      return null;
    }
    return new this.PostModel(dto);
  }

  async getPostWithLikes(id: string): Promise<PostResponseType> {
    const post = await this.postRepository.getOnePost(id);
    const simplePost = JSON.parse(JSON.stringify(post));
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    return {
      ...simplePost,
      likesInfo: likesInfo,
    };
  }
}
