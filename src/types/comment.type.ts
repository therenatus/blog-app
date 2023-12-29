import { HydratedDocument, Model } from "mongoose";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";
import { LikesAuthorType, LikesInfoType, LikesResponseType } from "./like.type";

export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

export type CommentType = {
  id: string;
  content: string;
  postId: string;
  commentatorId: string;
  likesInfo: LikesInfoType;
  likesAuthors: Array<LikesAuthorType>;
  createdAt: Date;
};

export type CommentStaticType = Model<CommentType> & {
  makeInstance(
    data: CreateCommentDto,
    postId: string,
    userId: string,
  ): HydratedDocument<CommentType>;
};
export type CommentResponseType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  likesInfo: LikesResponseType;
  createdAt: Date;
};
