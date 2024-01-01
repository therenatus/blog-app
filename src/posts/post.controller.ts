import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQuery } from './query/post.query';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postQuery: PostQuery,
  ) {}

  @Get()
  async getAllPosts(@Query() query: any) {
    return this.postQuery.getAllPosts(query);
  }

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postService.getOnePost(id);
  }

  @Put(':id')
  async updateOnePost(@Param('id') id: string, @Body() dto: CreatePostDto) {
    return this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  async deleteOnePost(@Param('id') id: string) {
    return this.postService.deleteBlog(id);
  }
}
