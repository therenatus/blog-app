import { PostRepository } from "../repositories/post.repository";
import { PostLikeRepository } from "../repositories/post-like.repository";
import { injectable } from "inversify";
import { LikeStatus, LikeType } from "../types/like.type";
import { PostLikeModel } from "../model/postLike.model";
import { UserRepository } from "../repositories/user.repository";
import { HydratedDocument } from "mongoose";

@injectable()
export class LikeBusinessLayer {
  constructor(
    protected repository: PostRepository,
    protected likeRepository: PostLikeRepository,
    protected userRepository: UserRepository,
  ) {}
  async prepareCommentForLike(
    postId: string,
    userId: string,
    status: LikeStatus,
  ) {
    let post = await this.likeRepository.findLike(postId, userId);
    let user = await this.userRepository.findOneById(userId);
    if (!user) {
      return null;
    }
    if (!post) {
      post = this.newLike(postId, user, status);
    }
    post = await this.updateLike(post, status);
    return this.likeRepository.save(post);
  }

  private newLike(
    postId: string,
    user: any,
    likeStatus: LikeStatus,
  ): HydratedDocument<LikeType> {
    console.log("user", user);
    return new PostLikeModel({
      postId,
      userId: user.accountData.id,
      likeStatus,
      createdAt: (+new Date()).toString(),
      userInfo: user._id, //d
    });
  }

  private async updateLike(
    like: HydratedDocument<LikeType>,
    likeStatus: LikeStatus,
  ) {
    like.likeStatus === likeStatus;
    return like;
  }
}
