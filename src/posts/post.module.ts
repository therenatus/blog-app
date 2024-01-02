import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostBusinessLayer } from './post.business';
import { PostQuery } from './query/post.query';
import { BlogModule } from '../blogs/blog.module';
import { CommentModule } from '../comments/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => BlogModule),
    CommentModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostBusinessLayer, PostQuery],
  exports: [
    PostRepository,
    PostQuery,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
})
export class PostModule {}
