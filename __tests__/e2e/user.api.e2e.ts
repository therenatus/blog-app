import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/router/route.path";
import { CreateUserDto } from "../../src/controller/dto/create-user.dto";
import { UserTestManager } from "../utils/userTestManager";
import { StatusEnum } from "../../src/types/status.enum";
import { UserType } from "../../src/types/user.types";
import { AuthTestManager } from "../utils/authTestManager";
import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  console.log(`Error to get ports`);
  process.exit(1);
}
const mongoURI = process.env.MONGO_URI;

const getRequest = () => {
  return request(app);
};

const userManager = new UserTestManager();
const authManager = new AuthTestManager();
const users: CreateUserDto[] = [
  {
    login: "admin",
    password: "123456",
    email: "ss@gmail.com",
  },
  {
    login: "admin2",
    password: "123456",
    email: "sss@gmail.com",
  },
];

describe("test api for user", () => {
  let createdUsers: UserType[] = [];
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await getRequest().delete(`/api/${RoutePath.test}`);
  });

  afterAll(async () => await mongoose.connection.close());

  it("should return 201 and new user", async () => {
    const token = authManager.basicLogin();
    for (let i = 0; i < users.length; i++) {
      const { createdEntity } = await userManager.createUser(
        users[i],
        token,
        201,
      );
      createdUsers.push(createdEntity);
    }
  });

  it("should return 200 and users entities", async () => {
    const token = authManager.basicLogin();
    const response = await getRequest()
      .get(`/api/${RoutePath.users}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      page: expect.any(Number),
      pageSize: expect.any(Number),
      pagesCount: expect.any(Number),
      totalCount: expect.any(Number),
      items: createdUsers,
    });
  });

  it("should return 404 for not existing entity", async () => {
    const token = authManager.basicLogin();
    await getRequest()
      .delete(`/api/${RoutePath.users}/111`)
      .set("Authorization", token)
      .expect(StatusEnum.NOT_FOUND);
  });

  it("should return 204 status code", async () => {
    const token = authManager.basicLogin();
    for (let i = 0; i < users.length; i++) {
      await getRequest()
        .delete(`/api/${RoutePath.users}/${createdUsers[i].id}`)
        .set("Authorization", token)
        .expect(StatusEnum.NOT_CONTENT);
    }
  });

  it("should return 401 status code for incorrect token", async () => {
    const incorrectToken = "YWRtaW46cXd1lcnR5eXk=";
    for (let i = 0; i < users.length; i++) {
      await getRequest()
        .delete(`/api/${RoutePath.users}/${users[i]}`)
        .set("Authorization", incorrectToken)
        .expect(StatusEnum.UNAUTHORIZED);
    }
  });
});
