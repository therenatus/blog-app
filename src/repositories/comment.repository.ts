import { IComment } from "../types/comment.interface";
import { CommentModel } from "../model/comment.model";

export class CommentRepository {
  async findOne(id: string): Promise<IComment | null> {
    return CommentModel.findOne({ id }, { _id: 0, postId: 0 }).lean();
  }

  async create(body: IComment): Promise<IComment | null> {
    return await CommentModel.create(body);
  }

  async update(id: string, data: IComment): Promise<boolean> {
    const comment = await CommentModel.findOneAndUpdate({ id }, { data });
    return !!comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const { deletedCount } = await CommentModel.deleteOne({ id });
    return deletedCount !== 0;
  }
}
