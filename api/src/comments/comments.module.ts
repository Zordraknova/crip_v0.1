import { ArticleService } from 'src/article/article.service';
import { CommentsController } from './comments.controller';
import { UsersService } from 'src/users/users.service';
import { Articles } from 'src/article/article.entity';
import { CommentsService } from './comments.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Comments } from './comments.entity';
import { Vote } from 'src/like/like.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, UsersService, JwtModule, ArticleService],
  imports: [
    TypeOrmModule.forFeature([Articles, User, Comments, Vote]),
    AuthModule
  ]
})
export class CommentsModule { }

