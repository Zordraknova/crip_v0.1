// import { Vote } from './../vote/vote.entity';
import { Comments } from './../comments/comments.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Articles } from 'src/article/article.entity';
import { UsersController } from './users.controller';
import { SharpPipe } from 'src/files/avatar.pipe';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { User } from './users.entity';
import { path } from 'app-root-path';



@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtModule, SharpPipe],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),                                    // импорт базы данных пользователя
    ServeStaticModule.forRoot({ rootPath: `${path}/uploads` }),
    Articles,
    Comments
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule { }
