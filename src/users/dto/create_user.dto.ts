import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class CreateUserDto {

    // @ApiProperty({ example: 'Elena', description: 'имя пользователя' })
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(3)
    // readonly username: string;

    @ApiProperty({ example: '123Qq321', description: 'пароль' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;

    @ApiProperty({ example: 'elena@gmail.com', description: 'почта' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

};