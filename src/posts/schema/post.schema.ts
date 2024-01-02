import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';

@Schema()
export class Post {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics.makeInstance = function (
  dto: CreatePostDto & { blogName: string },
) {
  const date = new Date();
  return new this({ ...dto, createdAt: date, id: (+date).toString() });
};

export type PostDocument = HydratedDocument<Post>;
export type PostStaticType = {
  makeInstance(dto: CreatePostDto): PostDocument;
};

export type PostModelType = Model<PostDocument> & PostStaticType;
