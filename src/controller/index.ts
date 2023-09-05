import express from "express";
import {BasicAuthMiddleware} from "../middleware/basicAuth.middleware";
import blogController from "./blog.controller";
import postController from './post.controller';
import blogTestController from './blog.controller.spec';
import UserController from "./user.controller";
import commentController from './comment.controller'
import authController from "./auth.controller";
import securityController from "./security.controller";

const router = express.Router();

router.use('/blogs', blogController);
router.use('/posts', postController);
router.use('/users', BasicAuthMiddleware, UserController);
router.use('/auth', authController);
router.use('/comments', commentController)
router.use('/testing', blogTestController);
router.use('/security/devices', securityController);

export default router;