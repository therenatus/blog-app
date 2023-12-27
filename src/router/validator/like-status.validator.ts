import { body } from "express-validator";
import { LikeStatus } from "../../types/comment.type";

export const LikeStatusValidator = [
  body("likeStatus")
    .isIn([LikeStatus.LIKE, LikeStatus.DISLIKE, LikeStatus.NONE])
    .withMessage('likeStatus must be either "Liked" or "Unliked'),
];
