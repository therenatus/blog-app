import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { BlogModule } from './blogs/blog.module';
import { PostModule } from './posts/post.module';
import { UserModule } from './users/user.module';
import { CommentModule } from './comments/comment.module';
import { TestingModule } from './testing/testing.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'your_default_mongo_uri'),
    BlogModule,
    PostModule,
    UserModule,
    CommentModule,
    TestingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
