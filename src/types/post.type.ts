import { LikesResponseType } from "./like.type";

export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type CreatePostType = {
  blogName: string;
  createdAt: Date;
  blogId: string;
  id: string;
};

export type PostResponseType = Omit<PostType, "likes"> & {
  extendedLikesInfo: LikeInfo;
};

export type LikeInfo = LikesResponseType & {
  newestLikes: NewestLikes[];
};

export type NewestLikes = {
  addedAt: Date;
  userId: string;
  login: string;
};
