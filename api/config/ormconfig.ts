import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comments } from 'src/comments/comments.entity';
import { Articles } from 'src/article/article.entity';
import { User } from 'src/users/users.entity';
import { Injectable } from '@nestjs/common';
import { Vote } from 'src/like/like.entity';
import { join } from 'path';

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            synchronize: true,                                  //_____!!!!!!!! Don't use /true/ on production
            dropSchema: false,
            logging: ['warn', 'error'],
            autoLoadEntities: true,
            entities: [User, Articles, Comments, Vote],
            migrationsRun: true,
            migrations: [join(__dirname, '../migration/*{.ts,.js}')],
            migrationsTableName: 'migrations_typeorm',
            keepConnectionAlive: true,

        };
    }
}