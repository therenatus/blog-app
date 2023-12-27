import mongoose from "mongoose";
import {
  CommentStaticType,
  CommentType,
  LikeStatus,
} from "../types/comment.type";
import { ObjectId } from "mongodb";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";

export const CommentSchema = new mongoose.Schema<
  CommentType,
  CommentStaticType
>({
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

CommentSchema.static(
  "makeInstance",
  function makeInstance(
    data: CreateCommentDto,
    postId: string,
    userId: string,
  ) {
    return new CommentModel({
      ...data,
      _id: new ObjectId(),
      id: (+new Date()).toString(),
      createdAt: new Date(),
      postId: postId,
      commentatorId: userId,
      likesAuthors: [],
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    });
  },
);
export const CommentModel = mongoose.model<CommentType, CommentStaticType>(
  "comments",
  CommentSchema,
);
