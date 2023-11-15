import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/controller/route.path";
import { CreatePostDto } from "../../src/controller/dto/create-post.dto";
import { StatusEnum } from "../../src/types/status.enum";
import { IPost } from "../../src/types/post.interface";
import { IPaginationResponse } from "../../src/types/pagination-response.interface";

const getRequest = () => {
  return request(app);
};

export class PostTestManager {
  async createPost(
    id: string,
    data: CreatePostDto,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    const response = await getRequest()
      .post(`/api/${RoutePath.blogs}/${id}/posts`)
      .send(data)
      .set("Authorization", token)
      .expect(expectedStatusCode);

    if (expectedStatusCode === StatusEnum.CREATED) {
      this._checkResponseData(response.body);
    }
    return response;
  }

  async getPosts() {
    const response = await getRequest()
      .get(`/api/${RoutePath.posts}`)
      .expect(StatusEnum.SUCCESS);
    console.log(response.body);
    if (response.status === StatusEnum.SUCCESS) {
      this._checkResponsesData(response.body);
    }
  }

  async getPostById(id: string, expectedStatusCode: StatusEnum) {
    console.log(id);
    const response = await getRequest()
      .get(`/api/${RoutePath.posts}/${id}`)
      .expect(expectedStatusCode);

    if (response.status === StatusEnum.SUCCESS) {
      this._checkResponseData(response.body);
    }
  }

  async deletePost(id: string, token: string, expectedStatusCode: StatusEnum) {
    const a = await getRequest()
      .delete(`/api/${RoutePath.posts}/${id}`)
      .set("Authorization", token)
      .expect(expectedStatusCode);
  }

  async updatePost(
    id: string,
    data: CreatePostDto,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    await getRequest()
      .put(`/api/${RoutePath.posts}/${id}`)
      .send(data)
      .set("Authorization", token)
      .expect(expectedStatusCode);
  }

  private _checkResponseData(data: IPost) {
    expect(data).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
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
