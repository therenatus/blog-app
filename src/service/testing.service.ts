import { TestingRepository } from "../repositories/testing.repository";

export class TestingService {
  constructor(protected repository: TestingRepository) {}
  async deleteAllData() {
    console.log("testing service", await this.repository.deleteAll());
    return await this.repository.deleteAll();
  }
}
