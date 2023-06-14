import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

	@ApiProperty({ example: 'We are the champions', description: 'статус' })
	bio: string;

	@ApiProperty({ example: 'Anna Bolton', description: 'имя' })
	username: string;

	@ApiProperty({ example: 'fgh123', description: 'пароль' })
	password: string;

	@ApiProperty({ example: 'http://image', description: 'аватар' })
	profileImage?: string;

	banned: boolean;

	refreshToken?: string;

}