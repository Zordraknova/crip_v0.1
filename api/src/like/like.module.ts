import { Comments } from 'src/comments/comments.entity';
import { Articles } from 'src/article/article.entity';
import { LikeController } from './like.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { LikeService } from './like.service';
import { Module } from '@nestjs/common';
import { Vote } from './like.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Articles, User, Comments, Vote]),
		AuthModule,
	],
	providers: [LikeService,],
	controllers: [LikeController]
})
export class LikeModule { }