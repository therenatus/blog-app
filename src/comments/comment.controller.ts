import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get(':id')
  async getOneComment(@Param('id') id: string) {
    return this.service.getOneComment(id);
  }
}
