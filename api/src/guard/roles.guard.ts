import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { KEY_ROLES } from './roles.decorator';
import { Roles } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
//_____проверка ролей пользователя
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private jwtService: JwtService,
		private reflector: Reflector) {
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		try {
			const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(KEY_ROLES, [
				context.getHandler(),
				context.getClass(),
			]);
			console.log(requiredRoles)
			const req = context.switchToHttp().getRequest()
			const authHeader = req.headers.authorization;
			const bearer = authHeader.split(' ')[0];
			const token = authHeader.split(' ')[1];

			if (!requiredRoles) {
				return true;
			}

			if (bearer !== 'Bearer' || !token) {
				throw new HttpException('Пользаватель не аторизован', HttpStatus.CONFLICT)
			}
			const user = this.jwtService.verify(token);
			req.user = user;
			console.log(user.roles)
			return requiredRoles.some((role) => user?.roles?.includes(role));
		} catch (e) {
			throw new HttpException('нет доступа', HttpStatus.CONFLICT);
		}
	}
}
//______________////______________////______________////______________////______________//