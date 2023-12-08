import mongoose from "mongoose";
import { IComment } from "../types/comment.interface";

export const CommentSchema = new mongoose.Schema<IComment>({
  id: { type: String, require },
  content: { type: String, require },
  postId: { type: String, require },
  commentatorId: { type: String, require },
  createdAt: { type: Date, require },
});

export const CommentModel = mongoose.model<IComment>("comments", CommentSchema);
