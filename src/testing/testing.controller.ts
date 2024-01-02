import { Controller, Delete } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Controller('testing')
export class TestingController {
  constructor(private readonly repository: TestingRepository) {}

  @Delete('all-data')
  async deleteAll() {
    return await this.repository.deleteAll();
  }
}
