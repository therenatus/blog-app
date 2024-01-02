import { Controller } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Controller()
export class TestingController {
  constructor(private readonly repository: TestingRepository) {}

  async deleteAll() {
    return await this.repository.deleteAll();
  }
}
