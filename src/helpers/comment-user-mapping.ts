import { UserDBType } from "../types/user.types";
import {
  CommentResponseType,
  CommentType,
  LikeStatus,
} from "../types/comment.interface";
import { WithId } from "mongodb";

export const CommentUserMapping = (
  comment: WithId<CommentType>,
  author: UserDBType,
): CommentResponseType => {
  const { commentatorId, likesAuthors, _id, postId, ...newComment } = comment;
  return {
    ...newComment,
    commentatorInfo: {
      userId: author.accountData.id,
      userLogin: author.accountData.login,
    },
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: likesAuthors.length ? likesAuthors[0].status : LikeStatus.NONE,
    },
  };
};
