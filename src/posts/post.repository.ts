import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { Model } from 'mongoose';
import { PostType } from './types/post.type';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async save(post: PostDocument): Promise<PostType> {
    return post.save();
  }

  async getOnePost(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({ id });
  }

  async deleteOnePost(id: string): Promise<boolean> {
    const { deletedCount } = await this.PostModel.deleteOne({ id });
    return deletedCount === 1;
  }
}
