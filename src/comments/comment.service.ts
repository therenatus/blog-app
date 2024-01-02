import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly repository: CommentRepository) {}

  async getOneComment(id: string): Promise<any | null> {
    const comment: any = this.repository.getOneComment(id);
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };
    const commentatorInfo = {
      userId: 'string',
      userLogin: 'string',
    };
    comment.likesInfo = likesInfo;
    comment.commentatorInfo = commentatorInfo;
    return comment;
  }
}
