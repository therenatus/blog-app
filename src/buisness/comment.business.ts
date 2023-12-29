import { PostRepository } from "../repositories/post.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserDBType } from "../types/user.types";
import { CommentUserMapping } from "../helpers/comment-user-mapping";
import { CommentType } from "../types/comment.type";
import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";
import { CommentRepository } from "../repositories/comment.repository";
import { JwtService } from "../helpers/jwtService";
import { WithId } from "mongodb";
import { LikeStatus } from "../types/like.type";

@injectable()
export class CommentBusinessLayer {
  constructor(
    protected repository: CommentRepository,
    protected postRepository: PostRepository,
    protected userRepository: UserRepository,
    protected jwtService: JwtService,
  ) {}
  async verifyToCreate(
    postId: string,
    userId: string,
  ): Promise<UserDBType | false> {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      return false;
    }
    const author = await this.userRepository.findOneById(userId);
    if (!author) {
      return false;
    }
    return author;
  }

  async prepareCommentForLike(
    commentId: string,
    userId: string,
    status: LikeStatus,
  ): Promise<HydratedDocument<CommentType> | null> {
    let comment = await this.repository.findOneWithLike(
      commentId,
      userId,
      false,
    );
    if (comment === null) {
      const newLike = await this.newLike(commentId, userId, status);
      if (!newLike) {
        return null;
      }
      comment = newLike;
    }
    await this.updateLikesStatus(comment, status);

    return comment;
  }

  commentWithUser(comment: CommentType, author: UserDBType) {
    const commentWithUser = CommentUserMapping(comment, author);
    if (!commentWithUser) {
      return false;
    }
    return commentWithUser;
  }

  private async updateLikesStatus(
    comment: HydratedDocument<CommentType>,
    status: LikeStatus,
  ) {
    if (comment.likesAuthors[0].status !== status) {
      if (status === LikeStatus.LIKE) {
        comment.likesInfo.likesCount += 1;
        comment.likesInfo.dislikesCount -= 1;
        comment.likesAuthors[0].status = status;
      } else if (status === LikeStatus.DISLIKE) {
        comment.likesInfo.likesCount -= 1;
        comment.likesInfo.dislikesCount += 1;
        comment.likesAuthors[0].status = status;
      } else if (status === LikeStatus.NONE) {
        if (comment.likesAuthors[0].status === LikeStatus.LIKE) {
          comment.likesInfo.likesCount -= 1;
        } else if (comment.likesAuthors[0].status === LikeStatus.DISLIKE) {
          comment.likesInfo.dislikesCount -= 1;
        }
        comment.likesAuthors = [];
      }
      return comment;
    }
    if (comment.likesAuthors[0].status === status) {
      return comment;
    }
  }

  async getUserIdFromAuth(
    auth: string | undefined,
  ): Promise<{ id: string } | null> {
    if (auth) {
      return this.jwtService.getUserByToken(auth.split(" ")[1]);
    }
    return null;
  }

  async getCommentForUser(
    id: string,
    userId: { id: string } | null,
  ): Promise<WithId<CommentType> | null> {
    if (userId) {
      const query = await this.repository.findOneWithLike(id, userId.id, true);
      if (query !== null) {
        return query;
      }
    }
    const comment = await this.repository.findOne(id);
    if (comment === null) {
      return null;
    }
    comment.likesAuthors = [];
    return comment;
  }

  private async newLike(
    commentId: string,
    userId: string,
    status: LikeStatus,
  ): Promise<HydratedDocument<CommentType> | null> {
    const newLike = await this.repository.findSmartOne(commentId);
    if (!newLike) {
      return null;
    }
    newLike.likesAuthors.push({
      userId: userId,
      status: status,
    });
    if (status === LikeStatus.LIKE) {
      newLike.likesInfo.likesCount += 1;
    } else if (status === LikeStatus.DISLIKE) {
      newLike.likesInfo.dislikesCount += 1;
    }
    return newLike;
  }
}
