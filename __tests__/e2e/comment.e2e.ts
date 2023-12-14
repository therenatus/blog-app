import { CommentTestManager } from "../utils/commentTestManager";
import { StatusEnum } from "../../src/types/status.enum";
import { PostTestManager } from "../utils/postTestManager";
import { BlogTestManager } from "../utils/blogTestManager";
import { CreatePostDto } from "../../src/controller/dto/create-post.dto";
import { CreateBlogDto } from "../../src/controller/dto/create-blog.dto";
import { RoutePath } from "../../src/router/route.path";
import { AuthTestManager } from "../utils/authTestManager";
import request from "supertest";
import { app } from "../../src";
import { CreateCommentDto } from "../../src/controller/dto/create-comment.dto";
import { CommentType } from "../../src/types/comment.interface";
import { UserTestManager } from "../utils/userTestManager";
import { ILogin } from "../../src/types/user.types";
import { CreateUserDto } from "../../src/controller/dto/create-user.dto";
import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  console.log(`Error to get ports`);
  process.exit(1);
}
const mongoURI = process.env.MONGO_URI;

const getRequest = () => {
  return request(app);
};

const data: CreateCommentDto = {
  content: "Comment lkhlskahdkaslkdlaskjdlakshdlashdlakshdlkashldhalskd",
};

const updateData: CreateCommentDto = {
  content: "Comment lkhlskahdkaslkdlaskjdlakshdlashdlakshdlkashldhalskd",
};

const postData: CreatePostDto = {
  title: "Title @",
  shortDescription: "description",
  content: "Content",
};

const user: CreateUserDto = {
  login: "admin",
  password: "123456",
  email: "ss@gmail.com",
};

const login: ILogin = {
  loginOrEmail: "admin",
  password: "123456",
};

const blogData: CreateBlogDto = {
  name: "Blog 33",
  description: "description",
  websiteUrl: "https://google.com",
};

const incorrectToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2OTg1NTk2NDU4MTQiLCJkZXZpY2VJZCI6IjBiMTA1MDE0LTQwOTQtNGJjMy05MDYxLWU5YjJlOGYyNTAwZSIsImlhdCI6MTY5ODU1OTY0NywiZXhwIjoxNjk4NTYwODQ3fQ.KEiroD-VWl3ZvPUqOk31G462epxPttYWYUuHIi3yaGI";

const manager = new CommentTestManager();
const postManager = new PostTestManager();
const blogManager = new BlogTestManager();
const authManager = new AuthTestManager();
const userManager = new UserTestManager();
describe("test comment api", () => {
  let token: string;
  let comment: CommentType;
  let accessToken: string;
  let refreshToken: string;
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    token = authManager.basicLogin();
    await getRequest().delete(`/api${RoutePath.test}`);
    await userManager.createUser(user, token, StatusEnum.CREATED);
    const { response, loginRes } = await authManager.login(
      login,
      StatusEnum.SUCCESS,
    );
    accessToken = loginRes.accessToken;
    refreshToken = response.header["set-cookie"];
  });

  afterAll(async () => await mongoose.connection.close());

  it("GET / should return 200 status code and empty array", async () => {
    await manager.getComments();
  });

  it("POST / should return 201 status code and new comment entity", async () => {
    const blogResponse = await blogManager.createBlog(
      blogData,
      token,
      StatusEnum.CREATED,
    );
    const postResponse = await postManager.createPost(
      blogResponse.body.id,
      postData,
      token,
      StatusEnum.CREATED,
    );
    const response = await manager.createComment(
      postResponse.body.id,
      accessToken,
      data,
    );
    comment = response.body as CommentType;
    await manager.getCommentById(comment.id, StatusEnum.SUCCESS);
  });

  it("GET /:id should return 404 status code", async () => {
    await manager.getCommentById("1", StatusEnum.NOT_FOUND);
  });

  it("GET /: should return 200 status code and comment entity", async () => {
    await manager.getCommentById(comment.id, StatusEnum.SUCCESS);
  });

  it("PUT /:id should return 404 for not exist", async () => {
    await manager.updateComment(
      "1",
      updateData,
      accessToken,
      StatusEnum.NOT_FOUND,
    );
  });

  it("PUT /:id should return 401 for incorrect token", async () => {
    await manager.updateComment(
      comment.id,
      updateData,
      incorrectToken,
      StatusEnum.UNAUTHORIZED,
    );
  });

  it("PUT /:id should return 204 status code", async () => {
    await manager.updateComment(
      comment.id,
      updateData,
      accessToken,
      StatusEnum.NOT_CONTENT,
    );
  });

  // it("DELETE /:id should return 404 status code for not exist", async () => {
  //   await manager.deleteComment("1", accessToken, StatusEnum.NOT_FOUND);
  // });
  //
  // it("DELETE /:id should return 401 for incorrect token", async () => {
  //   await manager.deleteComment(comment.id, token, StatusEnum.UNAUTHORIZED);
  // });
  //
  // it("DELETE /:id should return 204 status code", async () => {
  //   await manager.deleteComment(
  //     comment.id,
  //     accessToken,
  //     StatusEnum.NOT_CONTENT,
  //   );
  //   await manager.getCommentById(comment.id, StatusEnum.NOT_FOUND);
  // });
  //
  // it("GET /: should return 200 status code and comment entity", async () => {
  //   await manager.getCommentById(comment.id, StatusEnum.NOT_FOUND);
  // });
});
