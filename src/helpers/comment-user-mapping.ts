import { UserDBType } from "../types/user.types";
import { CommentResponseType, CommentType } from "../types/comment.type";
import { LikeStatus } from "../types/like.type";

export const CommentUserMapping = (
  comment: CommentType,
  author: UserDBType,
): CommentResponseType => {
  const simpleObject = JSON.parse(JSON.stringify(comment));
  const { commentatorId, likesAuthors, _id, __v, postId, ...newComment } =
    simpleObject;
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
