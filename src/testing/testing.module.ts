import { Module } from '@nestjs/common';
import { BlogModule } from '../blogs/blog.module';
import { CommentModule } from '../comments/comment.module';
import { PostModule } from '../posts/post.module';
import { UserModule } from '../users/user.module';
import { TestingRepository } from './testing.repository';
import { TestingController } from './testing.controller';

@Module({
  imports: [BlogModule, CommentModule, PostModule, UserModule],
  providers: [TestingRepository],
  controllers: [TestingController],
})
export class TestingModule {}
