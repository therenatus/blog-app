import { injectable } from "inversify";
import { PostRepository } from "../repositories/post.repository";
import { PostLikeRepository } from "../repositories/post-like.repository";
import { LikesCount, LikeStatus, LikeType } from "../types/like.type";
import {
  LikeInfo,
  NewestLikes,
  PostResponseType,
  PostType,
} from "../types/post.type";
import { JwtService } from "../helpers/jwtService";
import { UserRepository } from "../repositories/user.repository";
import { QueryBuilder } from "../helpers/query-builder";
import { TMeta } from "../types/meta.type";

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

  queryBuilder(query: any) {
    return QueryBuilder(query);
  }

  metaData(querySearch: any, totalCount: number = 0): TMeta {
    return {
      ...querySearch,
      totalCount,
    };
  }
  async findAllWithLikes(querySearch: any, auth: any) {
    let user: any | null;
    if (!auth) {
      user = null;
    } else {
      user = await this.jwtService.getUserByToken(auth.split(" ")[1]);
    }
    const { data, totalCount } = await this.repository.find(querySearch);
    const postWithLikes = await Promise.all(
      data.map(async (post) => {
        const newestLikes = await this.findNewestLikes(post.id);
        const { likesCount, dislikesCount } = await this.likeCount(post.id);
        const userLike = user
          ? await this.likeRepository.findLike(post.id, user.id)
          : null;
        let likes: NewestLikes[] = [];
        newestLikes.forEach((like) => {
          likes.push({
            addedAt: like.createdAt,
            login: like.userInfo.accountData.login,
            userId: like.userId,
          });
        });
        const likeInfo: LikeInfo = {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: userLike ? userLike.likeStatus : LikeStatus.NONE,
          newestLikes: likes,
        };
        return {
          ...post,
          extendedLikesInfo: likeInfo,
        };
      }),
    );

    return { data: postWithLikes, totalCount };
  }

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

  postResponseMapping(items: PostResponseType[], meta: TMeta) {
    return {
      pageSize: meta.pageSize,
      page: meta.pageNumber,
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
      items: items,
    };
  }

  private async findNewestLikes(postId: string): Promise<LikeType[]> {
    return this.likeRepository.findNewestLikes(postId);
  }

  private async likeCount(postId: string): Promise<LikesCount> {
    return this.likeRepository.likeCount(postId);
  }

  private async postWithLike(
    post: PostType,
    like: LikeType | null,
  ): Promise<PostResponseType> {
    const newestLikes = await this.findNewestLikes(post.id);
    const simplePost = JSON.parse(JSON.stringify(post));
    const { likesCount, dislikesCount } = await this.likeCount(post.id);
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
        dislikesCount,
        likesCount,
        myStatus: like ? like.likeStatus : LikeStatus.NONE,
        newestLikes: likes,
      },
    };
  }
}
