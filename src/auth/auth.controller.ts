import { ALREADY_REGISTED_ERROR } from './../../config/error.config';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './../users/dto/create_user.dto';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService,
		private readonly userServ: UsersService) {

	}
	//LOGIN
	@ApiOperation({ summary: 'Вход в учётную запись' })
	@Post('/login')
	login(@Body() userDto: CreateUserDto) {
		return this.authService.login(userDto)
	}

	//REGISTRATION
	@ApiOperation({ summary: 'Регистрация' })
	@Post('/registration')
	async registration(@Body() userDto: CreateUserDto) {
		const oldUser = await this.userServ.findOneByEmail(userDto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTED_ERROR);
		}
		return this.authService.registration(userDto)
	}
}
