import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { deleteIDandV } from '../helpers/simplefy';

@Injectable()
export class CommentService {
  constructor(private readonly repository: CommentRepository) {}

  async getOneComment(id: string): Promise<any | null> {
    const comment: any = this.repository.getOneComment(id);
    const newComment = deleteIDandV(comment);
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };
    const commentatorInfo = {
      userId: 'string',
      userLogin: 'string',
    };
    newComment.likesInfo = likesInfo;
    newComment.commentatorInfo = commentatorInfo;
    return newComment;
  }
}
