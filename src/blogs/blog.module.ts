import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { BlogService } from './blog.service';
import { BlogBusinessLayer } from './blog.business';

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogRepository, BlogService, BlogBusinessLayer],
})
export class BlogModule {}
