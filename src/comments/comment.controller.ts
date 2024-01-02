import { Controller, Get, Param, Res } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get(':id')
  async getOneComment(@Res() res, @Param('id') id: string) {
    const comment = await this.service.getOneComment(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return comment;
  }
}
