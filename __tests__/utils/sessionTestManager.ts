import request from "supertest";
import { app } from "../../src";
import { SessionType } from "../../src/types/session.type";
import { RoutePath } from "../../src/router/route.path";
import { StatusEnum } from "../../src/types/status.enum";

const getRequest = () => {
  return request(app);
};

export class SessionTestManager {
  async createSession(data: SessionType) {
    await getRequest()
      .post(`/api/${RoutePath.security}`)
      .send(data)
      .expect(StatusEnum.CREATED);
  }

  async getAllSession(token: string) {
    const sessions = await getRequest()
      .get(`/api${RoutePath.security}`)
      .set("Cookie", token)
      .expect(StatusEnum.SUCCESS);
    if (sessions.status === StatusEnum.SUCCESS) {
      return sessions;
    }
    return sessions;
  }

  //  async updateSession() {}

  async deleteAllSession(token: string, expectedStatusCode: StatusEnum) {
    await getRequest()
      .delete(`/api${RoutePath.security}`)
      .set("Cookie", token)
      .expect(expectedStatusCode);
  }

  async deleteOneSession(
    id: string,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    await getRequest()
      .delete(`/api${RoutePath.security}/${id}`)
      .set("Cookie", token)
      .expect(expectedStatusCode);
  }
}
