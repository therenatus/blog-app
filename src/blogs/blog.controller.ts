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
  async getOneBlog(@Res() res, @Param('id') id: string) {
    const blog = await this.service.getOneBlog(id);
    console.log(blog);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json(blog);
  }

  @Put(':id')
  async updateOne(
    @Res() res,
    @Param('id') id: string,
    @Body() dto: CreateBlogDto,
  ) {
    const blog = await this.service.updateBlog(id, dto);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(204).json(blog);
  }

  @Delete(':id')
  async deleteOneBlog(@Res() res, @Param('id') id: string) {
    const blog = await this.service.deleteBlog(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(204).json();
  }

  @Post(':id/posts')
  async createPost(
    @Res() res,
    @Param('id') id: string,
    @Body() dto: CreateBlogsPostDto,
  ) {
    const posts = await this.service.createPost(id, dto);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(201).json(posts);
  }

  @Get(':id/posts')
  async getBlogsPosts(
    @Param('id') id: string,
    @Query() query: any,
    @Res() res,
  ) {
    const posts = await this.service.getBlogsPosts(id, query);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(posts);
  }
}
