import { User } from 'src/users/users.model';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configSevice: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configSevice.get('PRIVATE_KEY')
		});
	}

	async validate(payload: any) {
		return {
			userId: payload.id,
			username: payload.username,
			roles: payload.roles,
			ban: payload.ban
		};
	}
}