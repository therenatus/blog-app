import { Injectable } from '@nestjs/common';
import { CreateBlogsPostDto } from './dto/create-blogsPost.dto';
import { BlogRepository } from './blog.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostStaticType,
} from '../posts/schema/post.schema';
import { Model } from 'mongoose';
import { deleteIDandV } from '../helpers/simplefy';

@Injectable()
export class BlogBusinessLayer {
  constructor(
    private readonly blogRepository: BlogRepository,
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument> & PostStaticType,
  ) {}

  async createPost(id: string, dto: CreateBlogsPostDto) {
    const blog = await this.blogRepository.getOneBlog(id);
    if (!blog) {
      return null;
    }

    const postInstance = { ...dto, blogName: blog.name, blogId: blog.id };
    const post = this.PostModel.makeInstance(postInstance);
    const newPost = await post.save();
    const simplePost = deleteIDandV(newPost);
    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    return {
      ...simplePost,
      extendedLikesInfo: likesInfo,
    };
  }
}
