import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Controller('testing')
export class TestingController {
  constructor(private readonly repository: TestingRepository) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    return await this.repository.deleteAll();
  }
}
