import request from "supertest";
import { app } from "../../src";
import { ISession } from "../../src/types/session.interface";
import { RoutePath } from "../../src/controller/route.path";
import { StatusEnum } from "../../src/types/status.enum";
import { IPaginationResponse } from "../../src/types/pagination-response.interface";
import { IPost } from "../../src/types/post.interface";

const getRequest = () => {
  return request(app);
};

export class SessionTestManager {
  async createSession(data: ISession) {
    await getRequest()
      .post(`/api/${RoutePath.security}`)
      .send(data)
      .expect(StatusEnum.CREATED);
  }

  async getAllSession() {
    const sessions = await getRequest()
      .get(`/api/${RoutePath.security}`)
      .expect(StatusEnum.SUCCESS);
    if (sessions.status === StatusEnum.SUCCESS) {
      return sessions;
    }
    return sessions;
  }

  //  async updateSession() {}

  async deleteAllSession(token: string, expectedStatusCode: StatusEnum) {
    await getRequest()
      .delete(`/api/${RoutePath.security}`)
      .set("Cookie", token)
      .expect(expectedStatusCode);
  }

  async deleteOneSession(id: string, expectedStatusCode: StatusEnum) {
    await getRequest()
      .delete(`/api/${RoutePath.security}/${id}`)
      .expect(expectedStatusCode);
  }

  private _checkResponsesData(data: IPaginationResponse<IPost>) {
    expect(data).toEqual(
      expect.objectContaining({
        pageSize: expect.any(Number),
        page: expect.any(Number),
        pagesCount: expect.any(Number),
        totalCount: expect.any(Number),
        items: expect.any(Array),
      }),
    );
  }
}
