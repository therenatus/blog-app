import { RoutePath } from "../../src/controller/route.path";
import { AuthTestManager } from "../utils/authTestManager";
import request from "supertest";
import { app } from "../../src";
import { CreatePostDto } from "../../src/controller/dto/create-post.dto";
import { PostTestManager } from "../utils/postTestManager";
import { BlogTestManager } from "../utils/blogTestManager";
import { CreateBlogDto } from "../../src/controller/dto/create-blog.dto";
import { StatusEnum } from "../../src/types/status.enum";
import { IPost } from "../../src/types/post.interface";
import { IBlog } from "../../src/types/blog.interface";

const manager = new PostTestManager();
const authManager = new AuthTestManager();
const blogManager = new BlogTestManager();

const getRequest = () => {
  return request(app);
};

const data: CreatePostDto = {
  title: "Title @",
  shortDescription: "description",
  content: "Content",
};

const updatePost: CreatePostDto = {
  title: "New Title",
  shortDescription: "New Description",
  content: "New Content",
};

const blogData: CreateBlogDto = {
  name: "Blog 33",
  description: "description",
  websiteUrl: "https://google.com",
};

const incorrectToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2OTg1NTk2NDU4MTQiLCJkZXZpY2VJZCI6IjBiMTA1MDE0LTQwOTQtNGJjMy05MDYxLWU5YjJlOGYyNTAwZSIsImlhdCI6MTY5ODU1OTY0NywiZXhwIjoxNjk4NTYwODQ3fQ.KEiroD-VWl3ZvPUqOk31G462epxPttYWYUuHIi3yaGI";

describe("/api/posts test post api", () => {
  let token: string;
  let post: IPost;
  let blog: IBlog;
  beforeAll(async () => {
    token = authManager.basicLogin();
    await getRequest().delete(`/api/${RoutePath.test}`);
  });

  it("should return 201 and new post entity", async () => {
    const responseBlog = await blogManager.createBlog(
      blogData,
      token,
      StatusEnum.CREATED,
    );
    const response = await manager.createPost(
      responseBlog.body.id,
      data,
      token,
      StatusEnum.CREATED,
    );
    expect(response.status).toBe(StatusEnum.CREATED);
    post = response.body;
    blog = responseBlog.body;
    await manager.getPostById(post.id, StatusEnum.SUCCESS);
  });

  it("GET /:id should return 404", async () => {
    await manager.getPostById("1", StatusEnum.NOT_FOUND);
  });

  it("GET /:id should return 200 ant post entity", async () => {
    await manager.getPostById(post.id, StatusEnum.SUCCESS);
  });

  it("GET / should return 200 and post array", async () => {
    await manager.getPosts();
  });

  it("PUT /:id should return 204 code status", async () => {
    updatePost.blogId = blog.id;
    await manager.updatePost(
      post.id,
      updatePost,
      token,
      StatusEnum.NOT_CONTENT,
    );
  });

  it("PUT /:id should return 401 code status for incorrect token", async () => {
    await manager.updatePost(
      post.id,
      updatePost,
      incorrectToken,
      StatusEnum.UNAUTHORIZED,
    );
  });

  it("DELETE /:id should return 401 code status for incorrect token", async () => {
    await manager.deletePost(post.id, incorrectToken, StatusEnum.UNAUTHORIZED);
  });

  it("DELETE /:id should return 204 code status", async () => {
    await manager.deletePost(post.id, token, StatusEnum.NOT_CONTENT);
  });
});
