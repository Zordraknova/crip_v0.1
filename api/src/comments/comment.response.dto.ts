import { IsNotEmpty, Min, MinLength, MaxLength } from 'class-validator';


export class CommentDto {


	parentId?: string;

	@IsNotEmpty()
	@MaxLength(500)
	@MinLength(2)
	body: string;

}