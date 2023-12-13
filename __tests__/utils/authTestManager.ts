import { ILogin } from "../../src/types/user.types";
import { StatusEnum } from "../../src/types/status.enum";
import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/router/route.path";

export class AuthTestManager {
  basicLogin() {
    const username = "admin";
    const password = "qwerty";
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    return `Basic ${token}`;
  }

  async login(data: ILogin, expectedStatusCode: StatusEnum) {
    let loginRes;
    const response = await request(app)
      .post(`/api/${RoutePath.auth}/login`)
      .send(data)
      .expect(expectedStatusCode);

    if (expectedStatusCode === StatusEnum.SUCCESS) {
      loginRes = response.body;
      expect(loginRes).toEqual({
        accessToken: expect.any(String),
      });
    }
    return { response, loginRes };
  }

  async updateRefreshToken(token: string) {
    const response = await request(app)
      .post(`/api/${RoutePath.auth}/refresh-token`)
      .set("Cookie", token);
    expect(response.status).toBe(StatusEnum.SUCCESS);
    return response;
  }
}
