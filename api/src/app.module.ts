import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CommentsModule } from './comments/comments.module';
import { DatabaseConnectionService } from 'config/ormconfig';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ArticleModule } from './article/article.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { WinstonModule } from 'nest-winston';
import { Module } from "@nestjs/common";
import { memoryStorage } from 'multer';
import { path } from 'app-root-path';

// Основной модуль приложния
@Module({
    controllers: [],                                          //импорт контроллера
    providers: [],                                            //импорт сервиса
    imports: [
        ConfigModule.forRoot({                                //конфигурация переменной окружения
            envFilePath: `${process.env.NODE_ENV}.env`
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConnectionService,              //DB Connect config
        }),

        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads/profileimages`                   // static файлы для отдачи на клиент
        }),
        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads/static`                   // static файлы для отдачи на клиент
        }),
        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads/articles`                   // static файлы для отдачи на клиент
        }),
        ServeStaticModule.forRoot({
            rootPath: `${path}/public`                   // static файлы для отдачи на клиент
        }),
        ScheduleModule.forRoot(),
        MulterModule.register({
            storage: memoryStorage()
        }),
        WinstonModule.forRoot({
        }),
        UsersModule,
        AuthModule,
        ArticleModule,
        CommentsModule,
        LikeModule,
    ]
})
export class AppModule { };
