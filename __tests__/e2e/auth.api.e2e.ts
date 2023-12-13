import request from "supertest";
import { RoutePath } from "../../src/router/route.path";
import { app } from "../../src";
import { AuthTestManager } from "../utils/authTestManager";
import { StatusEnum } from "../../src/types/status.enum";
import { UserTestManager } from "../utils/userTestManager";
import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  console.log(`Error to get ports`);
  process.exit(1);
}
const mongoURI = process.env.MONGO_URI;

const authManager = new AuthTestManager();
const userManager = new UserTestManager();
const getRequest = () => {
  return request(app);
};

const user = {
  login: "admin",
  password: "123456",
  email: "ss@gmail.com",
};

const login = {
  password: "123456",
  loginOrEmail: "admin",
};

// const sessionData: ISession[] = [
//   {
//     ip: "192.192.192.192",
//     title: "MacOS",
//     lastActiveDate: new Date(),
//     deviceId: uuidv4(),
//   },
//   {
//     ip: "192.192.192.192",
//     title: "MacOS",
//     lastActiveDate: new Date(),
//     deviceId: uuidv4(),
//   },
//   {
//     ip: "192.192.192.192",
//     title: "MacOS",
//     lastActiveDate: new Date(),
//     deviceId: uuidv4(),
//   },
//   {
//     ip: "192.192.192.192",
//     title: "MacOS",
//     lastActiveDate: new Date(),
//     deviceId: uuidv4(),
//   },
// ];

let refreshToken: string;
let accessToken: string;
const incorrectToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2OTg1NTk2NDU4MTQiLCJkZXZpY2VJZCI6IjBiMTA1MDE0LTQwOTQtNGJjMy05MDYxLWU5YjJlOGYyNTAwZSIsImlhdCI6MTY5ODU1OTY0NywiZXhwIjoxNjk4NTYwODQ3fQ.KEiroD-VWl3ZvPUqOk31G462epxPttYWYUuHIi3yaGI";
describe("Authorization test", () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    const token = authManager.basicLogin();
    await getRequest().delete(`/api${RoutePath.test}`);
    await userManager.createUser(user, token, 201);
  });
  afterAll(async () => await mongoose.connection.close());

  it("should return 200 status code and access token", async () => {
    const { response, loginRes } = await authManager.login(
      login,
      StatusEnum.SUCCESS,
    );

    refreshToken = response.header["set-cookie"];
    accessToken = loginRes.accessToken;

    expect(response.status).toBe(StatusEnum.SUCCESS);
    expect(loginRes.accessToken).toEqual(expect.any(String));
  });

  it("should return 200 status code and refresh token", async () => {
    const response = await getRequest()
      .post(`/api${RoutePath.auth}/refresh-token`)
      .set("Cookie", refreshToken);

    accessToken = response.body.accessToken;
    expect(response.status).toBe(StatusEnum.SUCCESS);
  });

  it("should return 401 status code", async () => {
    const response = await getRequest()
      .post(`/api${RoutePath.auth}/refresh-token`)
      .set("Cookie", incorrectToken);
    expect(response.status).toBe(StatusEnum.UNAUTHORIZED);
  });

  it("should return 200 status code and auth user data", async () => {
    const response = await getRequest()
      .get(`/api${RoutePath.auth}/me`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(StatusEnum.SUCCESS);
    expect(response.body).toEqual({
      userId: expect.any(String),
      email: expect.any(String),
      login: expect.any(String),
    });
  });

  it("should return 401 status code", async () => {
    const response = await getRequest()
      .get(`/api${RoutePath.auth}/me`)
      .set("Authorization", `Bearer ${incorrectToken}`);
    expect(response.status).toBe(StatusEnum.UNAUTHORIZED);
  });
});
