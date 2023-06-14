import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
import { ALREADY_REGISTED_ERROR, UNAUTHTORIZE_ERROR } from 'config/error.config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

// проверка авторизации пользователя и верификация пользователя

@Injectable()
export class tokenAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
	) {
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest()
		try {
			const req = context.switchToHttp().getRequest(); // получаем контекст
			const bearToken = req.headers.authorization;
			const token = bearToken.split(' ')[1]
			const ber = bearToken.split(' ')[0]

			if (!token || ber !== 'Bearer') {
				throw new UnauthorizedException(ALREADY_REGISTED_ERROR);
			}
			const user = this.jwtService.verify(token);
			req.user = user;
			return true;
		} catch (e) {

			throw new UnauthorizedException(UNAUTHTORIZE_ERROR)
		}
	}
}
//______________////______________////______________////______________////______________//