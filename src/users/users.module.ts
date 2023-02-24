import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [                                       // импорт базы данных
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule { }
