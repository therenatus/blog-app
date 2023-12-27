import { HydratedDocument, Model } from "mongoose";
import { CreateBlogDto } from "../controller/dto/create-blog.dto";

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogStaticType = Model<BlogType> & {
  makeInstance(data: CreateBlogDto): HydratedDocument<BlogType>;
};
