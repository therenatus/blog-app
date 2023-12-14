import { TestingRepository } from "../repositories/testing.repository";

export class TestingService {
  constructor(protected repository: TestingRepository) {}
  async deleteAllData() {
    return await this.repository.deleteAll();
  }
}
