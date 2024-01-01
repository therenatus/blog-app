import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { PostBusinessLayer } from './post.business';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postBusinessLayer: PostBusinessLayer,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}

  async getOnePost(id: string): Promise<Post | null> {
    return this.postBusinessLayer.getPostWithLikes(id);
  }

  async updatePost(id: string, dto: CreatePostDto): Promise<Post | boolean> {
    const blog = await this.postRepository.getOnePost(id);
    if (!blog) {
      return false;
    }
    const newBlog = new this.PostModel(dto);
    return this.postRepository.save(newBlog);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.postRepository.deleteOnePost(id);
  }
}
