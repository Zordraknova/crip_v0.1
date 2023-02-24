import { UsersModule } from './users/users.module';
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopPageModule } from './top-page/top-page.module';
import { ArticleModule } from './article/article.module';
import { CommentsModule } from './comments/comments.module';
import { VoteModule } from './vote/vote.module';
import { AuthModule } from './auth/auth.module';


// Основной модуль приложния
@Module({
    controllers: [],                                        //импорт контроллера
    providers: [],                                           //импорт сервиса
    imports: [
        ConfigModule.forRoot({                               //конфигурация переменной окружения
            envFilePath: `${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRESS_PASSWORD),
            database: process.env.POSTGRES_DB,
            synchronize: true,                                  //_____!!!!!!!! Don't use on production
            logging: true,
            autoLoadEntities: true,
            entities: [User],                   // Подключенные БД
            migrations: [],
        }),
        UsersModule,
        AuthModule,
        TopPageModule,
        ArticleModule,
        CommentsModule,
        VoteModule

    ]

})
export class AppModule { };
