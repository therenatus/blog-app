import { injectable } from "inversify";
import { PostLikeModel } from "../model/postLike.model";
import { HydratedDocument } from "mongoose";
import { LikesCount, LikeStatus, LikeType } from "../types/like.type";
import { Query } from "../buisness/post.business";

@injectable()
export class PostLikeRepository {
  async findLike(
    postId: string,
    userId: string,
  ): Promise<HydratedDocument<LikeType> | null> {
    return PostLikeModel.findOne({ postId: postId, userId: userId });
  }

  async findLikes(query: Query): Promise<LikeType | null> {
    return PostLikeModel.findOne(query);
  }

  async save(like: HydratedDocument<LikeType>): Promise<LikeType> {
    return like.save();
  }

  async findNewestLikes(postId: string): Promise<LikeType[]> {
    return PostLikeModel.find({ postId })
      .sort({ createdAt: "desc" })
      .limit(3)
      .populate("userInfo");
  }

  async likeCount(postId: string): Promise<LikesCount> {
    const likesCount = await PostLikeModel.countDocuments({
      postId,
      likeStatus: LikeStatus.LIKE,
    });
    const dislikesCount = await PostLikeModel.countDocuments({
      postId,
      likeStatus: LikeStatus.DISLIKE,
    });
    return {
      likesCount,
      dislikesCount,
    };
  }
}
