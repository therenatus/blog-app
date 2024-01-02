import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { Blog, BlogModelType } from './schema/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogsPostDto } from './dto/create-blogsPost.dto';
import { Post } from '../posts/schema/post.schema';
import { BlogBusinessLayer } from './blog.business';
import { PostQuery } from '../posts/query/post.query';
import { PaginationResponse } from '../types/pagination-response.type';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    private readonly blogRepository: BlogRepository,
    private readonly blogBusinessLayer: BlogBusinessLayer,
    private readonly postQuery: PostQuery,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<Blog> {
    const blog = this.BlogModel.makeInstance(dto);
    return this.blogRepository.save(blog);
  }

  async createPost(id: string, dto: CreateBlogsPostDto): Promise<Post | null> {
    return this.blogBusinessLayer.createPost(id, dto);
  }

  async getBlogsPosts(
    id: string,
    query: any,
  ): Promise<PaginationResponse<Post[]> | null> {
    const blog = await this.getOneBlog(id);
    if (!blog) {
      return null;
    }
    return this.postQuery.getAllPosts(query, id);
  }

  async getOneBlog(id: string): Promise<Blog | null> {
    return this.blogRepository.getOneBlog(id);
  }

  async updateBlog(id: string, dto: CreateBlogDto): Promise<Blog | null> {
    const blog = await this.blogRepository.getOneBlog(id);
    if (!blog) {
      return null;
    }
    const newBlog = new this.BlogModel(dto);
    return this.blogRepository.save(newBlog);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogRepository.deleteOneBlog(id);
  }
}
