import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Comment {
  @Prop()
  id: string;

  @Prop()
  content: string;

  @Prop()
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;
