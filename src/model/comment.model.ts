import mongoose from "mongoose";
import { CommentType, LikeStatus } from "../types/comment.interface";

export const CommentSchema = new mongoose.Schema<CommentType>({
  id: { type: String, require },
  content: { type: String, require },
  postId: { type: String, require },
  commentatorId: { type: String, require },
  likesInfo: {
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  likesAuthors: {
    type: [
      {
        userId: { type: String, required: true },
        status: {
          type: String,
          enum: Object.values(LikeStatus),
          default: LikeStatus.NONE,
        },
      },
    ],
    default: [],
  },
  createdAt: { type: Date, require },
});

export const CommentModel = mongoose.model<CommentType>(
  "comments",
  CommentSchema,
);
