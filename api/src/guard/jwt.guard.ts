import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// JWT
@Injectable()
export class JwtGuard extends AuthGuard('jwt') { }