import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/controller/route.path";
import { StatusEnum } from "../../src/types/status.enum";
import { IBlog } from "../../src/types/blog.interface";
import { CreateBlogDto } from "../../src/controller/dto/create-blog.dto";
import { BlogTestManager } from "../utils/blogTestManager";
import { AuthTestManager } from "../utils/authTestManager";
import { UpdateBlogDto } from "../../src/controller/dto/update-blog.dto";
import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  console.log(`Error to get ports`);
  process.exit(1);
}
const mongoURI = process.env.MONGO_URI;

const manager = new BlogTestManager();
const authManager = new AuthTestManager();
const getRequest = () => {
  return request(app);
};

const data: CreateBlogDto = {
  name: "Blog 33",
  description: "description",
  websiteUrl: "https://google.com",
};

const newData: UpdateBlogDto = {
  name: "New name",
  description: "New description",
  websiteUrl: "https://google.com",
};
const incorrectToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2OTg1NTk2NDU4MTQiLCJkZXZpY2VJZCI6IjBiMTA1MDE0LTQwOTQtNGJjMy05MDYxLWU5YjJlOGYyNTAwZSIsImlhdCI6MTY5ODU1OTY0NywiZXhwIjoxNjk4NTYwODQ3fQ.KEiroD-VWl3ZvPUqOk31G462epxPttYWYUuHIi3yaGI";
describe("/api/blogs/ test for blog api", () => {
  let blog1: IBlog;
  let token: string;

  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await getRequest().delete(`/api${RoutePath.test}`);
    token = authManager.basicLogin();
  });

  afterAll(async () => await mongoose.connection.close());

  it("GET / should return 200 and empty array", async () => {
    await manager.getBlogs();
  });

  it("POST / should return 201 and new entity", async () => {
    const response = await manager.createBlog(data, token, StatusEnum.CREATED);
    blog1 = response.body;
    await manager.getBlogById(blog1.id, StatusEnum.SUCCESS);
  });

  it("GET /:id/post should return 200 and empty array", async () => {
    await manager.getBlogPosts(blog1.id, StatusEnum.SUCCESS);
  });

  it("GET /:id should return 404 for not existing entity", async () => {
    await manager.getBlogById("1", StatusEnum.NOT_FOUND);
  });

  it("GET / should return 200 and blogs", async () => {
    await manager.getBlogs();
  });

  it("PUT /:id should return status 404 for not existing entity", async () => {
    await manager.updateBlog("1", newData, token, StatusEnum.NOT_FOUND);
  });

  it("PUT /:id should return status 401 for incorrect auth token", async () => {
    await manager.updateBlog(
      blog1.id,
      newData,
      incorrectToken,
      StatusEnum.UNAUTHORIZED,
    );
  });

  it("PUT /:id should return status 204", async () => {
    await manager.updateBlog(blog1.id, newData, token, StatusEnum.NOT_CONTENT);
  });

  // it("DELETE /:id should return status 404 for not existing entity", async () => {
  //   await manager.deleteBlog("1", StatusEnum.NOT_FOUND, token);
  // });
  //
  // it("DELETE /:id should return status 401 for incorrect auth token", async () => {
  //   await manager.deleteBlog(blog1.id, StatusEnum.UNAUTHORIZED, incorrectToken);
  // });
  //
  // it("DELETE /:id should return status 204", async () => {
  //   await manager.deleteBlog(blog1.id, StatusEnum.NOT_CONTENT, token);
  //   await manager.getBlogById(blog1.id, StatusEnum.NOT_FOUND);
  // });
});
