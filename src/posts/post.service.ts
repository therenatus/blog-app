import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { PostBusinessLayer } from './post.business';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postBusinessLayer: PostBusinessLayer,
  ) {}

  async getOnePost(id: string): Promise<Post | null> {
    return this.postBusinessLayer.getPostWithLikes(id);
  }

  async createPost(dto: CreatePostDto) {
    return this.postBusinessLayer.createPost(dto);
  }

  async updatePost(id: string, dto: CreatePostDto): Promise<Post | null> {
    const updatedPost = await this.postBusinessLayer.updatePost(id, dto);
    if (!updatedPost) {
      return null;
    }
    return this.postRepository.save(updatedPost);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postRepository.deleteOnePost(id);
  }
}
