import { forwardRef, Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { BlogService } from './blog.service';
import { BlogBusinessLayer } from './blog.business';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { BlogQuery } from './query/blog.query';
import { PostModule } from '../posts/post.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => PostModule),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, BlogBusinessLayer, BlogQuery],
  exports: [
    BlogRepository,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
})
export class BlogModule {}
