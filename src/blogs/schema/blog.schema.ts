import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogStaticType } from '../types/blog.type';

export class Blog {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.statics.makeInstance = function (dto: CreateBlogDto): BlogDocument {
  const date = new Date();
  return new this({
    ...dto,
    createdAt: date,
    id: (+date).toString(),
    isMembership: false,
  });
};

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & BlogStaticType;
