import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQuery } from './query/post.query';
import { CommentService } from '../comments/comment.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly postQuery: PostQuery,
  ) {}

  @Get()
  async getAllPosts(@Query() query: any) {
    return this.postQuery.getAllPosts(query);
  }

  @Post()
  async createPost(@Body() dto: CreatePostDto) {
    return this.postService.createPost(dto);
  }

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postService.getOnePost(id);
  }

  @Get(':id/posts')
  async getOneComments(@Param('id') id: string) {
    return this.commentService.getOneComment(id);
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
