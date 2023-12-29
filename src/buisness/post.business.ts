import { injectable } from "inversify";
import { PostRepository } from "../repositories/post.repository";
import { PostLikeRepository } from "../repositories/post-like.repository";
import { LikeStatus, LikeType } from "../types/like.type";
import { NewestLikes, PostResponseType, PostType } from "../types/post.type";
import { JwtService } from "../helpers/jwtService";
import { UserRepository } from "../repositories/user.repository";

export interface Query {
  postId: string;
  userId?: string;
}

@injectable()
export class PostBusinessLayer {
  constructor(
    protected repository: PostRepository,
    protected likeRepository: PostLikeRepository,
    protected userRepository: UserRepository,
    protected jwtService: JwtService,
  ) {}

  async verifyUser(auth: string) {
    const token = auth.split(" ")[1];
    return await this.jwtService.getUserByToken(token);
  }
  async findOneWithLikes(postId: string, userId?: string) {
    const query: Query = { postId };
    if (userId) {
      query.userId = userId;
    }
    const post = await this.repository.findOne(postId);
    if (!post) {
      return null;
    }
    let like = await this.likeRepository.findLikes(query);
    if (!userId) {
      like = null;
    }
    return this.postWithLike(post, like);
  }

  private async findNewestLikes(postId: string): Promise<LikeType[]> {
    return this.likeRepository.findNewestLikes(postId);
  }

  private async likeCount(postId: string): Promise<number> {
    return this.likeRepository.likeCount(postId, LikeStatus.LIKE);
  }

  private async dislikeCount(postId: string): Promise<number> {
    return this.likeRepository.likeCount(postId, LikeStatus.DISLIKE);
  }

  private async postWithLike(
    post: PostType,
    like: LikeType | null,
  ): Promise<PostResponseType> {
    const newestLikes = await this.findNewestLikes(post.id);
    const likeCount = await this.likeCount(post.id);
    const disLikeCount = await this.dislikeCount(post.id);
    const simplePost = JSON.parse(JSON.stringify(post));
    const { __v, ...planedObject } = simplePost;
    let likes: NewestLikes[] = [];
    newestLikes.map(async (like) => {
      likes.push({
        addedAt: like.createdAt,
        login: like.userInfo.accountData.login,
        userId: like.userId,
      });
    });
    return {
      ...planedObject,
      extendedLikesInfo: {
        dislikesCount: disLikeCount,
        likesCount: likeCount,
        myStatus: like ? like.likeStatus : LikeStatus.NONE,
        newestLikes: likes,
      },
    };
  }
}
