import {
	Injectable,
	BadRequestException,
	UnauthorizedException
} from '@nestjs/common';
import {
	ALREADY_REGISTED_ERROR,
	WRONG_EMAIL_ERROR,
	WRONG_PASSWORD_ERROR
} from 'config/error.config';
import { CreateUserDto } from 'src/users/dto/create_user.dto';
import { User, UserResponse } from 'src/users/users.entity';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UsersService,
		private jwtService: JwtService) {
	}

	//_____SingIn
	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto);
		return this.genToken(user);
	}

	//_____SingUp
	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.findOneByEmail(userDto.email);
		if (candidate) {
			throw new BadRequestException(ALREADY_REGISTED_ERROR);
		}
		const hashPassword = await bcrypt.hash(userDto.password, 5);	//hash with salt
		const user = await this.userService.createUser({ ...userDto, password: hashPassword });
		return this.genToken(user)
	}

	//_____Генерация jwt-токена
	async genToken(user: UserResponse): Promise<{
		access_token: string;
	}> {
		const payload = {
			id: user.id,
			roles: user.role,
			ban: user.banned
		};
		return {
			access_token: this.jwtService.sign(payload)
		}
	}
	//_____роли пользователя
	async roleUser(id: string, data): Promise<{
		access_token: string
	}> {
		const user = await this.userService.promiseByIdUser(id)
		this.userService.updateRoleOfUser(id, data);
		return this.genToken(user)
	}
	// _____Bалидация пользователя
	private async validateUser(userDto: CreateUserDto): Promise<User> {
		const user = await this.userService.findOneByEmail(userDto.email);
		if (!user) {
			throw new UnauthorizedException(WRONG_EMAIL_ERROR);
		};
		const passEq = await bcrypt.compare(userDto.password, user.password);
		if (!passEq) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		};
		return user;
	}
	// _____Обновить токен пользователя
	async updateTokens(user: UserResponse): Promise<{
		access_token: string;
	}> {
		return this.genToken(user)
	}
}
//______________///______________////______________////______________////______________////______________//