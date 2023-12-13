import BlogRouter from "./blog.router";
import PostRouter from "./post.router";
import TestRouter from "./testing.router";
import UserRouter from "./user.router";
import CommentRouter from "./comment.router";
import AuthRouter from "./auth.router";
import SecurityRouter from "./security.router";
import { RoutePath } from "./route.path";
import express from "express";
import { BasicAuthMiddleware } from "../middleware/basicAuth.middleware";

const router = express.Router();

router.use(RoutePath.blogs, BlogRouter);
router.use(RoutePath.posts, PostRouter);
router.use(RoutePath.users, BasicAuthMiddleware, UserRouter);
router.use(RoutePath.auth, AuthRouter);
router.use(RoutePath.comments, CommentRouter);
router.use("/testing", TestRouter);
router.use(RoutePath.security, SecurityRouter);

export default router;
