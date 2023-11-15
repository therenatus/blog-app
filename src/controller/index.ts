import express from "express";
import { BasicAuthMiddleware } from "../middleware/basicAuth.middleware";
import blogController from "./blog.controller";
import postController from "./post.controller";
import testController from "./testing.controller";
import UserController from "./user.controller";
import commentController from "./comment.controller";
import authController from "./auth.controller";
import securityController from "./security.controller";
import { RoutePath } from "./route.path";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(RoutePath.blogs, blogController);
router.use(RoutePath.posts, postController);
router.use(RoutePath.users, BasicAuthMiddleware, UserController);
router.use(RoutePath.auth, authController);
router.use(RoutePath.comments, commentController);
router.use("/testing", testController);
router.use(RoutePath.security, securityController);

export default router;
