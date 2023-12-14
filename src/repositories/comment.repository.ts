import { CommentType } from "../types/comment.interface";
import { CommentModel } from "../model/comment.model";
import { HydratedDocument } from "mongoose";

export class CommentRepository {
  async findOne(id: string): Promise<CommentType | null> {
    return CommentModel.findOne({ id }).lean();
  }

  async findSmartOne(
    id: string,
  ): Promise<HydratedDocument<CommentType> | null> {
    return CommentModel.findOne({ id });
  }

  async findOneWithLike(
    id: string,
    userId: string,
    shouldLean: boolean,
  ): Promise<HydratedDocument<CommentType> | null> {
    let query = CommentModel.findOne({
      id,
      "likesAuthors.userId": userId,
    });
    if (shouldLean) {
      query = query.lean();
    }

    return query;
  }

  async create(body: CommentType): Promise<CommentType | null> {
    return await CommentModel.create(body);
  }

  async update(id: string, data: CommentType): Promise<boolean> {
    const comment = await CommentModel.findOneAndUpdate({ id }, { data });
    return !!comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const { deletedCount } = await CommentModel.deleteOne({ id });
    return deletedCount !== 0;
  }

  async updateComment(comment: HydratedDocument<CommentType>) {
    return await comment.save();
  }
}
