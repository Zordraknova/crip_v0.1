import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsString, IsOptional } from 'class-validator';

export class UpdateArticleDto {
	@IsNotEmpty()
	@MaxLength(50, { message: 'не более 50 символов' })
	@IsOptional()
	title: string;

	@MaxLength(50, { message: 'не более 50 символов' })
	@IsOptional()
	description: string;

	@MaxLength(3000, { message: 'не более 2000 символов' })
	@IsOptional()
	content: string;

	@ApiProperty()
	tagList?: string[];

	@ApiProperty()
	editor?: string;

	@IsString()
	@IsOptional()
	headerImage?: string;
}