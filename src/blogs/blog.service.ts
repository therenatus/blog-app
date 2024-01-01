import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { Blog, BlogModelType } from './schema/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogQuery } from './query/blog.query';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    private readonly blogRepository: BlogRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<Blog> {
    const blog = this.BlogModel.makeInstance(dto);
    return this.blogRepository.save(blog);
  }

  async getOneBlog(id: string): Promise<Blog | null> {
    return this.blogRepository.getOneBlog(id);
  }

  async updateBlog(id: string, dto: CreateBlogDto): Promise<Blog | boolean> {
    const blog = await this.blogRepository.getOneBlog(id);
    if (!blog) {
      return false;
    }
    const newBlog = new this.BlogModel(dto);
    return this.blogRepository.save(newBlog);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogRepository.deleteOneBlog(id);
  }
}
