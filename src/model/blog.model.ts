import * as mongoose from "mongoose";
import { BlogStaticType, BlogType } from "../types/blog.type";

export const BlogSchema = new mongoose.Schema<BlogType, BlogStaticType>({
  id: { type: String, require },
  name: { type: String, require },
  description: { type: String, require },
  websiteUrl: { type: String, require },
  createdAt: { type: Date, require },
  isMembership: { type: Boolean, require },
});

BlogSchema.static("makeInstance", function makeInstance(data) {
  const date = new Date();
  return new BlogModel({
    ...data,
    createdAt: date,
    id: (+date).toString(),
    isMembership: false,
  });
});
export const BlogModel = mongoose.model<BlogType, BlogStaticType>(
  "blogs",
  BlogSchema,
);
