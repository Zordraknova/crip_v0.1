import { BadRequestException, Body, Controller, Param, Post, HttpCode, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create_user.dto';
import { ALREADY_REGISTED_ERROR } from 'config/error.config';
import { UsersService } from 'src/users/users.service';
import { tokenAuthGuard } from 'src/guard/auth.guard';
import { UserDecor } from 'src/users/user.decorator';
import { UserResponse } from 'src/users/users.entity';
import { Patch } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService,
		private readonly userService: UsersService) {
	}
	//_____LOGIN
	@ApiOperation({ summary: 'Вход в учётную запись' })
	@ApiConsumes('application/json')
	@HttpCode(200)
	@Post('/login')
	login(@Body() userDto: CreateUserDto) {
		return this.authService.login(userDto);
	}
	//_____REGISTRATION
	@ApiOperation({ summary: 'Регистрация' })
	@ApiConsumes('application/json')
	@Post('/registration')
	async registration(@Body() userDto: CreateUserDto) {
		const oldUser = await this.userService.findOneByEmail(userDto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTED_ERROR);
		}
		return this.authService.registration(userDto);
	}
	//_____Roles_JWT
	@ApiBearerAuth()
	@HttpCode(200)
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Изменение роли пользователя c JWT!' })
	@UseGuards(tokenAuthGuard)
	@Patch('/role/:id')
	async roleUser(@Param('id') id: string, @Body() data) {
		const user = await this.userService.findUserById(id);
		return this.authService.roleUser(id, data);
	}
	//_____Update_JWT
	@ApiBearerAuth()
	@HttpCode(200)
	@ApiOperation({ summary: 'Get update jwt token' })
	@UseGuards(tokenAuthGuard)
	@Get('/access_token')
	async updateTokens(@UserDecor('user') user: UserResponse) {
		return this.authService.updateTokens(user);
	}
}
//______________////______________////______________////______________////______________////______________//