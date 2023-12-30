import mongoose from "mongoose";

import { LikeStatus, LikeType } from "../types/like.type";

export const PostLikeSchema = new mongoose.Schema<LikeType>({
  postId: { type: String, require: true },
  userId: { type: String, require: true },
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  likeStatus: {
    type: String,
    enum: Object.values(LikeStatus),
    default: LikeStatus.NONE,
    require: true,
  },
  createdAt: { type: String, require },
});

export const PostLikeModel = mongoose.model<LikeType>(
  "PostLike",
  PostLikeSchema,
);
