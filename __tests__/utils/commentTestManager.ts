import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/controller/route.path";
import { IComment } from "../../src/types/comment.interface";
import { StatusEnum } from "../../src/types/status.enum";
import { CreateCommentDto } from "../../src/controller/dto/create-comment.dto";

const getRequest = () => {
  return request(app);
};

export class CommentTestManager {
  async createComment(id: string, token: string, data: CreateCommentDto) {
    const response = await getRequest()
      .post(`/api/${RoutePath.posts}/${id}/comments`)
      .send(data)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusEnum.CREATED);
    return response;
  }

  async getComments() {}

  async getCommentById(id: string, expectedStatusCode: StatusEnum) {
    const response = await getRequest()
      .get(`/api/${RoutePath.comments}/${id}`)
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
    const response = await getRequest()
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
    const response = await getRequest()
      .delete(`/api/${RoutePath.comments}/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(expectedStatusCode);
  }

  private _checkComment(data: IComment) {
    expect(data).toMatchObject({
      id: expect.any(String),
      content: expect.any(String),
      // postId: expect.any(String),
      // commentatorId: expect.any(String),
      createdAt: expect.any(String),
    });
  }
}
