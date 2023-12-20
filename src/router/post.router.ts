import { BasicAuthMiddleware } from "../middleware/basicAuth.middleware";
import { container } from "../composition-root";
import { createPostValidator } from "./validator/create-post.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { CreateCommentValidator } from "./validator/create-comment.validator";
import express from "express";
import { PostController } from "../controller/post.controller";

const router = express.Router();
const postController = container.resolve(PostController);

router.put("*", BasicAuthMiddleware);
router.get("/", postController.getPosts.bind(postController));

router.post(
  "/",
  BasicAuthMiddleware,
  createPostValidator,
  InputValidationMiddleware,
  postController.create.bind(postController),
);

router.get("/:id", postController.getPost.bind(postController));

router.put(
  "/:id",
  createPostValidator,
  InputValidationMiddleware,
  postController.updatePost.bind(postController),
);

router.delete(
  "/:id",
  BasicAuthMiddleware,
  postController.deletePost.bind(postController),
);

router.post(
  "/:id/comments",
  AuthMiddleware,
  CreateCommentValidator,
  InputValidationMiddleware,
  postController.createComment.bind(postController),
);

router.get(
  "/:id/comments",
  postController.getPostComments.bind(postController),
);
export default router;
