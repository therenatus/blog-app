import {IUser, UserDBType} from "../types/user.types";
import {IComment, ICommentResponse} from "../types/comment.interface";

export const CommentUserMapping = (comment: IComment, author: UserDBType): ICommentResponse => {
  const { commentatorId, ...newComment} = comment;
  return {
    ...newComment,
    commentatorInfo: {
      userId: author.accountData.id,
      userLogin: author.accountData.login
    }
  }
}
