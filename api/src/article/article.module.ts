import { CommentsService } from 'src/comments/comments.service';
import { ArticleController } from './article.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Comments } from 'src/comments/comments.entity';
import { UsersService } from 'src/users/users.service';
import { Articles } from 'src/article/article.entity';
import { ArticleService } from './article.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Vote } from 'src/like/like.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { path } from 'app-root-path';
@Module({
	controllers: [ArticleController],
	providers: [ArticleService, JwtModule, UsersService, CommentsService],
	imports: [
		TypeOrmModule.forFeature([Articles, User, Comments, Vote]),
		ServeStaticModule.forRoot({ rootPath: `${path}/uploads` }),
		AuthModule
	]
})
export class ArticleModule { }

