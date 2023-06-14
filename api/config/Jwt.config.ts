import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';


export const ConfigJwt = async (configService: ConfigService): Promise<JwtModuleOptions> => {
	return {
		secret: configService.get('PRIVATE_KEY'),
		signOptions: { expiresIn: '1d' } //___________________________________ВРЕМЯ ЖИЗНИ ТОКЕНА
	}
}