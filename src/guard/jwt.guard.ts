import { AuthGuard } from '@nestjs/passport';
// JWT
export class JwtGuard extends AuthGuard('jwt') {

}