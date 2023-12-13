import request from "supertest";
import { app } from "../../src";
import { CreateBlogDto } from "../../src/controller/dto/create-blog.dto";
import { StatusEnum } from "../../src/types/status.enum";
import { RoutePath } from "../../src/router/route.path";
import { IBlog } from "../../src/types/blog.interface";
import { IPaginationResponse } from "../../src/types/pagination-response.interface";
import { UpdateBlogDto } from "../../src/controller/dto/update-blog.dto";

const getRequest = () => {
  return request(app);
};
export class BlogTestManager {
  async createBlog(
    data: CreateBlogDto,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    const response = await getRequest()
      .post(`/api/${RoutePath.blogs}`)
      .send(data)
      .set("Authorization", token)
      .expect(expectedStatusCode);

    if (expectedStatusCode === StatusEnum.CREATED) {
      this._checkResponseData(response.body);
    }
    return response;
  }

  async getBlogById(id: string, expectedStatusCode: StatusEnum) {
    const response = await getRequest()
      .get(`/api${RoutePath.blogs}/${id}`)
      .expect(expectedStatusCode);

    if (expectedStatusCode === StatusEnum.SUCCESS) {
      if (expectedStatusCode === StatusEnum.SUCCESS) {
        this._checkResponseData(response.body);
      }
    }
    return response;
  }

  async getBlogs() {
    const response = await getRequest()
      .get(`/api${RoutePath.blogs}`)
      .expect(StatusEnum.SUCCESS);

    if (response.status === StatusEnum.SUCCESS) {
      const data = response.body as IPaginationResponse<IBlog>;
      this._checkResponseDatas(data);
    }
  }

  async getBlogPosts(id: string, expectedStatusCode: StatusEnum) {
    const response = await getRequest()
      .get(`/api${RoutePath.blogs}/${id}/posts`)
      .expect(expectedStatusCode);

    if (response.status && expectedStatusCode === StatusEnum.SUCCESS) {
      const data = response.body as IPaginationResponse<IBlog>;
      this._checkResponseDatas(data);
    }
  }

  async deleteBlog(id: string, expectedStatusCode: StatusEnum, token: string) {
    await getRequest()
      .delete(`/api/${RoutePath.blogs}/${id}`)
      .set("Authorization", token)
      .expect(expectedStatusCode);
  }

  async updateBlog(
    id: string,
    data: UpdateBlogDto,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    await getRequest()
      .put(`/api${RoutePath.blogs}/${id}`)
      .send(data)
      .set("Authorization", token)
      .expect(expectedStatusCode);
  }

  private _checkResponseData(data: IBlog) {
    expect(data).toEqual(
      expect.objectContaining({
        createdAt: expect.any(String),
        description: expect.any(String),
        id: expect.any(String),
        isMembership: expect.any(Boolean),
        name: expect.any(String),
        websiteUrl: expect.any(String),
      }),
    );
  }

  private _checkResponseDatas(data: IPaginationResponse<IBlog>) {
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
