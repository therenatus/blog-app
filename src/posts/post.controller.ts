import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
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
  async getOnePost(@Res() res, @Param('id') id: string) {
    const post = await this.postService.getOnePost(id);
    if (!post) {
      return res.status(404).json({ message: 'Posts not found' });
    }
    return res.status(200).json(post);
  }

  @Get(':id/posts')
  async getOneComments(@Res() res, @Param('id') id: string) {
    const comment = await this.commentService.getOneComment(id);
    if (!comment) {
      return res.status(404).json({ message: 'Posts not found' });
    }
    return comment;
  }

  @Put(':id')
  async updateOnePost(
    @Res() res,
    @Param('id') id: string,
    @Body() dto: CreatePostDto,
  ) {
    const post = await this.postService.updatePost(id, dto);
    if (!post) {
      return res.status(404).json({ message: 'Posts not found' });
    }
    return;
  }

  @Delete(':id')
  async deleteOnePost(@Res() res, @Param('id') id: string) {
    const post = await this.postService.deletePost(id);
    if (!post) {
      return res.status(404).json({ message: 'Posts not found' });
    }
    return;
  }
}
