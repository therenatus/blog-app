import { CreateUserDto } from "../../src/controller/dto/create-user.dto";
import { StatusEnum } from "../../src/types/status.enum";
import request from "supertest";
import { app } from "../../src";
import { RoutePath } from "../../src/router/route.path";

export class UserTestManager {
  async createUser(
    data: CreateUserDto,
    token: string,
    expectedStatusCode: StatusEnum,
  ) {
    let createdEntity;
    const response = await request(app)
      .post(`/api/${RoutePath.users}`)
      .send(data)
      .set("Authorization", token)
      .expect(expectedStatusCode);

    if (expectedStatusCode === StatusEnum.CREATED) {
      createdEntity = response.body;
      expect(createdEntity).toEqual({
        id: expect.any(String),
        login: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
      });
    }
    return { response, createdEntity };
  }
}
