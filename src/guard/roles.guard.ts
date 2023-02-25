import { STOP_ERROR } from './../../config/error.config';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { KEY_ROLES } from './roles.decorator';
import { Roles } from 'src/users/users.model';
//проверка ролей пользователя
@Injectable()
export class rolesGuard implements CanActivate {
	constructor(private jwtService: JwtService,
		private reflector: Reflector) {
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		try {
			// const roles = this.reflector.get<string[]>(KEY_ROLES, context.getHandler());
			// console.log(roles)
			// if (!roles) {
			// 	return true;
			// }
			// const request = context.switchToHttp().getRequest();
			// const user = request.user;
			// return this.matchRoles(roles, user.role);
			// const reqRoles = this.reflector.get<string[]>(KEY_ROLES,
			// 	context.getHandler(),
			// )
			// if (!reqRoles) {
			// 	return true;
			// }
			// const req = context.switchToHttp().getRequest();
			// const bearToken = req.headers.authorization;
			// const token = bearToken.split(' ')[1]
			// const ber = bearToken.split(' ')[0]
			// if (!token || ber !== 'Bearer') {
			// 	throw new UnauthorizedException(ALREADY_REGISTED_ERROR);
			// }

			// const user = this.jwtService.verify(token);

			// req.user = user;
			// console.log(user, "  ", reqRoles, ' ', user.roles)

			// return user.roles.some(role => reqRoles.includes(user.roles));

			const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(KEY_ROLES, [
				context.getHandler(),
				context.getClass(),
			]);
			if (!requiredRoles) {
				return true;
			}
			const { user } = context.switchToHttp().getRequest();
			return requiredRoles.some((role) => user?.roles?.includes(role));


		} catch (e) {

			throw new UnauthorizedException(STOP_ERROR);
		}
	}
}