import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './schema/blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async save(blog: BlogDocument): Promise<Blog> {
    return blog.save();
  }

  async getOneBlog(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({ id });
  }

  async deleteOneBlog(id: string): Promise<boolean> {
    const { deletedCount } = await this.BlogModel.deleteOne({ id });
    return deletedCount === 1;
  }
}
