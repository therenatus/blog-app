import { UserDBType } from "../types/user.types";
import {
  CommentResponseType,
  CommentType,
  LikeStatus,
} from "../types/comment.interface";

export const CommentUserMapping = (
  comment: CommentType,
  author: UserDBType,
): CommentResponseType => {
  console.log(comment);
  const { commentatorId, likesAuthors, ...newComment } = comment;
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
