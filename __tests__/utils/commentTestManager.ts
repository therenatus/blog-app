import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/router/route.path";
import { IComment } from "../../src/types/comment.interface";
import { StatusEnum } from "../../src/types/status.enum";
import { CreateCommentDto } from "../../src/controller/dto/create-comment.dto";

const getRequest = () => {
  return request(app);
};

export class CommentTestManager {
  async createComment(id: string, token: string, data: CreateCommentDto) {
    return getRequest()
      .post(`/api${RoutePath.posts}/${id}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .expect(StatusEnum.CREATED);
  }

  async getComments() {}

  async getCommentById(id: string, expectedStatusCode: StatusEnum) {
    const response = await getRequest()
      .get(`/api${RoutePath.comments}/${id}`)
      .expect(expectedStatusCode);

    if (response.status === StatusEnum.SUCCESS) {
      this._checkComment(response.body);
    }
    return response;
  }

  async updateComment(
    id: string,
    data: CreateCommentDto,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    await getRequest()
      .put(`/api/${RoutePath.comments}/${id}`)
      .send(data)
      .set("Authorization", `Bearer ${token}`)
      .expect(expectedStatusCode);
  }

  async deleteComment(
    id: string,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    await getRequest()
      .delete(`/api/${RoutePath.comments}/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(expectedStatusCode);
  }

  private _checkComment(data: IComment) {
    expect(data).toMatchObject({
      id: expect.any(String),
      content: expect.any(String),
      createdAt: expect.any(String),
    });
  }
}
