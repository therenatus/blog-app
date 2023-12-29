import { UserDBType } from "./user.types";

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

export type LikeType = {
  userId: string;
  userInfo: UserDBType;
  postId: string;
  likeStatus: LikeStatus;
  createdAt: Date;
};
