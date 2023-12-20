import { TestingRepository } from "../repositories/testing.repository";
import { injectable } from "inversify";

@injectable()
export class TestingService {
  constructor(protected repository: TestingRepository) {}
  async deleteAllData() {
    return await this.repository.deleteAll();
  }
}
