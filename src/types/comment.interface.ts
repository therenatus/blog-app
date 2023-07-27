export interface ICommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface IComment {
  id: string;
  content: string;
  postId: string;
  commentatorId: string;
  createdAt: Date
}

export interface ICommentResponse {
  id: string;
  content: string;
  commentatorInfo: ICommentatorInfo;
  createdAt: Date
}
