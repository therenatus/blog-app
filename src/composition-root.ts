import "reflect-metadata";
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
import { Container } from "inversify";
import { EmailAdapter } from "./adapter/email-adapter";
import { AuthBusinessLayer } from "./buisness/auth.business";
import { TokenBusinessLayer } from "./buisness/token.business";
import { SessionBusinessLayer } from "./buisness/session.business";
import { CommentBusinessLayer } from "./buisness/comment.business";

export const container = new Container();

container.bind<AuthController>(AuthController).to(AuthController);
container.bind<BlogController>(BlogController).to(BlogController);
container.bind<CommentController>(CommentController).to(CommentController);
container.bind<PostController>(PostController).to(PostController);
container.bind<SecurityController>(SecurityController).to(SecurityController);
container.bind<TestingController>(TestingController).to(TestingController);
container.bind<UserController>(UserController).to(UserController);

container.bind<UserRepository>(UserRepository).to(UserRepository);
container.bind<BlogRepository>(BlogRepository).to(BlogRepository);
container.bind<CommentRepository>(CommentRepository).to(CommentRepository);
container.bind<PostRepository>(PostRepository).to(PostRepository);
container.bind<SessionRepository>(SessionRepository).to(SessionRepository);
container.bind<TestingRepository>(TestingRepository).to(TestingRepository);
container.bind<TokenRepository>(TokenRepository).to(TokenRepository);

container.bind<AuthService>(AuthService).to(AuthService);
container.bind<BlogService>(BlogService).to(BlogService);
container.bind<CommentService>(CommentService).to(CommentService);
container.bind<PostService>(PostService).to(PostService);
container.bind<SecurityService>(SecurityService).to(SecurityService);
container.bind<TestingService>(TestingService).to(TestingService);
container.bind<UserService>(UserService).to(UserService);
container.bind<EmailManagers>(EmailManagers).to(EmailManagers);
container.bind<JwtService>(JwtService).to(JwtService);

container.bind<AuthBusinessLayer>(AuthBusinessLayer).to(AuthBusinessLayer);
container.bind<TokenBusinessLayer>(TokenBusinessLayer).to(TokenBusinessLayer);
container
  .bind<SessionBusinessLayer>(SessionBusinessLayer)
  .to(SessionBusinessLayer);
container
  .bind<CommentBusinessLayer>(CommentBusinessLayer)
  .to(CommentBusinessLayer);

container.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter);
