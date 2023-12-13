import { AuthMiddleware } from "../middleware/auth.middleware";
import { CreateCommentValidator } from "./validator/create-comment.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { commentController } from "../composition-root";
import express from "express";
const router = express.Router();

router.put(
  "/:id",
  AuthMiddleware,
  CreateCommentValidator,
  InputValidationMiddleware,
  commentController.updateComment.bind(commentController),
);

router.get("/:id", commentController.getComment.bind(commentController));

router.delete(
  "/:id",
  AuthMiddleware,
  commentController.deleteComment.bind(commentController),
);

export default router;
