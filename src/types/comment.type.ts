import { HydratedDocument, Model } from "mongoose";
import { CreateCommentDto } from "../controller/dto/create-comment.dto";

export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

export type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
};

export type LikesAuthorType = {
  userId: string;
  status: LikeStatus;
};

export type LikesResponseType = LikesInfoType & {
  myStatus: LikeStatus;
};

export enum LikeStatus {
  LIKE = "Like",
  DISLIKE = "Dislike",
  NONE = "None",
}

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
