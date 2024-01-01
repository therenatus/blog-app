import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogDocument } from '../schema/blog.schema';

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogStaticType = Model<BlogType> & {
  makeInstance(data: CreateBlogDto): BlogDocument;
};
