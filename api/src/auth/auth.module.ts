import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigJwt } from 'config/Jwt.config';
import { JwtGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

//______________////______________////______________////______________////______________////______________//
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ConfigJwt
    }),
    PassportModule,
    ConfigModule
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule { }

//______________////______________////______________////______________////______________////______________//
