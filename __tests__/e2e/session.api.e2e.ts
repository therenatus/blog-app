import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/controller/route.path";
import { SessionTestManager } from "../utils/sessionTestManager";
import { UserTestManager } from "../utils/userTestManager";
import { CreateUserDto } from "../../src/controller/dto/create-user.dto";
import { AuthTestManager } from "../utils/authTestManager";
import { StatusEnum } from "../../src/types/status.enum";
import { SessionResponseType } from "../../src/types/session.interface";
import { ILogin } from "../../src/types/user.types";

const getRequest = () => {
  return request(app);
};

const user: CreateUserDto = {
  login: "admin",
  password: "123456",
  email: "ss@gmail.com",
};
const user2: CreateUserDto = {
  login: "admin2",
  password: "123456",
  email: "1@gmail.com",
};

const loginData: ILogin = {
  loginOrEmail: "admin",
  password: "123456",
};

const manager = new SessionTestManager();
const userManager = new UserTestManager();
const authManager = new AuthTestManager();

describe("Test session api", () => {
  let token: string;
  let refreshToken: string;
  let session: SessionResponseType[];
  beforeAll(async () => {
    token = authManager.basicLogin();
    await getRequest().delete(`/api${RoutePath.test}`);
    await userManager.createUser(user, token, StatusEnum.CREATED);
    await userManager.createUser(user2, token, StatusEnum.CREATED);
    await authManager.login(loginData, StatusEnum.SUCCESS);
    await authManager.login(loginData, StatusEnum.SUCCESS);
    await authManager.login(loginData, StatusEnum.SUCCESS);
    const { response: response2 } = await authManager.login(
      loginData,
      StatusEnum.SUCCESS,
    );
    refreshToken = response2.header["set-cookie"];
  });

  it("GET / should return 200 status code and array", async () => {
    const response = await manager.getAllSession(refreshToken[0]);
    session = response.body as SessionResponseType[];
  });

  it("DELETE /:id should return 404 status code", async () => {
    await manager.deleteOneSession("1", refreshToken[0], StatusEnum.NOT_FOUND);
  });

  it("DELETE /:id should return 204 status code", async () => {
    await manager.deleteOneSession(
      session[session.length - 1].deviceId,
      refreshToken[0],
      StatusEnum.NOT_CONTENT,
    );
  });

  it("DELETE / should return 204 status code", async () => {
    await manager.deleteAllSession(refreshToken[0], StatusEnum.NOT_CONTENT);
  });
});
