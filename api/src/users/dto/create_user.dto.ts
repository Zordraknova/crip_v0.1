import { ApiProperty } from "@nestjs/swagger";
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";



export class CreateUserDto {

    @ApiProperty({ example: 'Elena', description: 'имя пользователя' })
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(3)
    readonly username?: string;

    @ApiProperty({ example: 'Elena', description: 'имя пользователя' })
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(3)
    readonly role?: any;

    @ApiProperty({ example: '123Qq321', description: 'пароль' })
    @IsNotEmpty()
    @IsString()
    // @MinLength(6, { message: 'не меньше 6 символов' })
    @MaxLength(20, { message: 'не более 20 символов' })
    readonly password: string;

    @ApiProperty({ example: 'elena@gmail.com', description: 'почта' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    // @ApiProperty({ example: 'df78dfhkjklkjk8jh', description: 'refresh token' })
    // @IsNotEmpty()
    // readonly refreshToken: string;
};