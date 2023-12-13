import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./service/user.service";
import { BlogRepository } from "./repositories/blog.repository";
import { CommentRepository } from "./repositories/comment.repository";
import { PostRepository } from "./repositories/post.repository";
import { SessionRepository } from "./repositories/session.repository";
import { TokenRepository } from "./repositories/token.repository";
import { BlogService } from "./service/blog.service";
import { CommentService } from "./service/comment.service";
import { SecurityService } from "./service/security.service";
import { PostService } from "./service/post.service";
import { AuthService } from "./service/auth.service";
import { EmailManagers } from "./managers/email-managers";
import { JwtService } from "./helpers/jwtService";
import { UserController } from "./controller/user.controller";
import { AuthController } from "./controller/auth.controller";
import { BlogController } from "./controller/blog.controller";
import { CommentController } from "./controller/comment.controller";
import { PostController } from "./controller/post.controller";
import { SecurityController } from "./controller/security.controller";
import { TestingController } from "./controller/testing.controller";
import { TestingService } from "./service/testing.service";
import { TestingRepository } from "./repositories/testing.repository";

const userRepository = new UserRepository();
const blogRepository = new BlogRepository();
const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const sessionRepository = new SessionRepository();
const emailManager = new EmailManagers();
const jwtService = new JwtService();
const tokenRepository = new TokenRepository();
const testingRepository = new TestingRepository();

const authService = new AuthService(
  userRepository,
  emailManager,
  jwtService,
  tokenRepository,
  sessionRepository,
);
const userService = new UserService(userRepository);
const blogService = new BlogService(blogRepository);
const commentService = new CommentService(
  commentRepository,
  userRepository,
  postRepository,
);
const postService = new PostService(postRepository, blogRepository);
const sessionService = new SecurityService(sessionRepository, jwtService);
const testingService = new TestingService(testingRepository);

export const authController = new AuthController(authService);
export const blogController = new BlogController(blogService, postService);
export const commentController = new CommentController(commentService);
export const postController = new PostController(postService, commentService);
export const securityController = new SecurityController(sessionService);
export const userController = new UserController(userService);
export const testingController = new TestingController(testingService);
