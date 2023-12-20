import { BasicAuthMiddleware } from "../middleware/basicAuth.middleware";
import { container } from "../composition-root";
import { CreateBlogValidator } from "./validator/create-blog.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { CreatePostWithParamValidator } from "./validator/create-post-with-param.validator";
import express from "express";
import { BlogController } from "../controller/blog.controller";

const router = express.Router();

const blogController = container.resolve(BlogController);

router.post("*", BasicAuthMiddleware);
router.put("*", BasicAuthMiddleware);
router.get("/", blogController.getBlogs.bind(blogController));

router.post(
  "/",
  CreateBlogValidator,
  InputValidationMiddleware,
  blogController.createBlog.bind(blogController),
);

router.get("/:id", blogController.getBlogById.bind(blogController));

router.get("/:id/posts", blogController.getBlogPosts.bind(blogController));

router.post(
  "/:id/posts",
  CreatePostWithParamValidator,
  InputValidationMiddleware,
  blogController.createPost.bind(blogController),
);

router.put(
  "/:id",
  CreateBlogValidator,
  InputValidationMiddleware,
  blogController.updateBlog.bind(blogController),
);

router.delete(
  "/:id",
  BasicAuthMiddleware,
  blogController.deletePost.bind(blogController),
);

export default router;
