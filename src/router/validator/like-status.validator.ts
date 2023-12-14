import { body } from "express-validator";
import { LikeStatus } from "../../types/comment.interface";

export const LikeStatusValidator = [
  body("status")
    .isIn([LikeStatus.LIKE, LikeStatus.DISLIKE, LikeStatus.NONE])
    .withMessage('likeStatus must be either "Liked" or "Unliked'),
];
