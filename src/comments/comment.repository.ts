import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getOneComment(id: string): Promise<Comment | null> {
    return this.commentModel.findOne({ id });
  }
}
