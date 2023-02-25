import { ALREADY_REGISTED_ERROR } from './../../config/error.config';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UNAUTHTORIZE_ERROR } from 'config/error.config';
// проверка авторизации пользователя

@Injectable()
export class tokenAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
	) {
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest()
		try {
			const req = context.switchToHttp().getRequest();
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