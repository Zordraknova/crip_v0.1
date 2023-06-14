import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {

	@ApiProperty({ example: 'NEWS FROM AFRICA', description: 'заголовок' })
	@IsNotEmpty()
	@MaxLength(50, { message: 'не более 50 символов' })
	readonly title: string;

	@ApiProperty({ example: 'news for african people', description: 'описание' })
	@MaxLength(50, { message: 'не более 50 символов' })
	readonly description: string;

	@ApiProperty({ example: 'lorem ipsum sit....', description: 'контент' })
	@MaxLength(3000, { message: 'не более 2000 символов' })
	readonly content: string;

	@ApiProperty({ example: 'politics', description: 'тэги' })
	tagList?: string[];

	@ApiProperty()
	headerImage?: string;
}