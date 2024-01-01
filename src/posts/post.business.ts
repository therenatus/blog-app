import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostResponseType } from './types/post.type';

@Injectable()
export class PostBusinessLayer {
  constructor(private readonly postRepository: PostRepository) {}

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
