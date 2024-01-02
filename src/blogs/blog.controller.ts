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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogQuery } from './query/blog.query';
import { CreateBlogsPostDto } from './dto/create-blogsPost.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly service: BlogService,
    private readonly blogQuery: BlogQuery,
  ) {}

  @Get('')
  async getAllBlogs(@Query() query: any) {
    return this.blogQuery.getAllBlogs(query);
  }

  @Post()
  async createBlog(@Body() dto: CreateBlogDto) {
    return this.service.createBlog(dto);
  }

  @Get(':id')
  async getOneBlog(@Param('id') id: string) {
    return this.service.getOneBlog(id);
  }

  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() dto: CreateBlogDto) {
    return this.service.updateBlog(id, dto);
  }

  @Delete(':id')
  async deleteOmeBlog(@Param('id') id: string) {
    return this.service.deleteBlog(id);
  }

  @Post(':id/posts')
  async createPost(@Param('id') id: string, @Body() dto: CreateBlogsPostDto) {
    return this.service.createPost(id, dto);
  }

  @Get(':id/posts')
  async getBlogsPosts(@Param('id') id: string, @Query() query: any) {
    console.log(id);
    return this.service.getBlogsPosts(id, query);
  }
}
