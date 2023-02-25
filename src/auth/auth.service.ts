import { ALREADY_REGISTED_ERROR, WRONG_EMAIL_ERROR, WRONG_PASSWORD_ERROR } from './../../config/error.config';
import { UsersService } from './../users/users.service';
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash, hashSync } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create_user.dto';

@Injectable()
export class AuthService {


	constructor(private readonly usersServ: UsersService,
		private jwtServ: JwtService) {
	}
	//LOGIN

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto);
		return this.genToken(user)
	}

	//REGISTRATION

	async registration(userDto: CreateUserDto) {
		const SALT = await genSalt(5);
		const candidate = await this.usersServ.findOneByEmail(userDto.email);
		if (candidate) {
			throw new BadRequestException(ALREADY_REGISTED_ERROR);
		}
		const hashPassword = await hash(userDto.password, SALT);
		const user = await this.usersServ.createUser({ ...userDto, password: hashPassword });
		return this.genToken(user)
	}

	private async genToken(user) {
		const payload = { email: user.email, id: user.id, roles: user.role, username: user.username, ban: user.banned };
		return {
			token: this.jwtServ.sign(payload)
		}
	}

	private async validateUser(userDto: CreateUserDto) {
		const user = await this.usersServ.findOneByEmail(userDto.email)
		if (!user) {
			throw new UnauthorizedException(WRONG_EMAIL_ERROR);
		};
		console.log(userDto.password)
		console.log(user.password)
		const passEq = await compare(userDto.password, user.password);

		if (!passEq) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		};

		return user;
	}
}
