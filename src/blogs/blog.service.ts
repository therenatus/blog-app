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
import { deleteIDandV } from '../helpers/simplefy';
import { validateOrReject } from 'class-validator';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    private readonly blogRepository: BlogRepository,
    private readonly blogBusinessLayer: BlogBusinessLayer,
    private readonly postQuery: PostQuery,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<Blog> {
    const blogInstance = this.BlogModel.makeInstance(dto);
    const createdBlog = await this.blogRepository.save(blogInstance);
    return deleteIDandV(createdBlog);
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
    const blog = await this.blogRepository.getOneBlog(id);
    if (!blog) {
      return null;
    }
    return deleteIDandV(blog);
  }

  async updateBlog(id: string, dto: CreateBlogDto): Promise<Blog | null> {
    const blog = await this.blogRepository.getOneBlog(id);
    if (!blog) {
      return null;
    }
    Object.assign(blog, dto);
    return blog.save();
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogRepository.deleteOneBlog(id);
  }
}

const validate0rRejectModel = async (model: any, ctor: { new (): any }) => {
  if (!(model instanceof ctor)) {
    throw new Error('Incorrect input data');
  }
  try {
    await validateOrReject(model);
  } catch (error) {
    throw new Error(error);
  }
};
