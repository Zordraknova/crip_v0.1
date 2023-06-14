import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,//___________________________ИСТЕЧЕНИЕ_СРОКА ТОКЕНА(default production:false)
			passReqToCallback: true,
			secretOrKey: configService.get('PRIVATE_KEY')
		});
	}

	// Валидация JWT токена
	async validate(payload: any) {
		return {
			userId: payload.id,
			username: payload.username,
			roles: payload.roles,
			ban: payload.ban
		};
	}

	private static extractJWT(req): string | null {
		if ('access_token') {
			return req.access_token;
		}
		return null;
	}
}
//______________////______________////______________////______________////______________//