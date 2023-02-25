import { UpdateDateColumn } from 'typeorm';
import { Roles, User } from './users.model';
import { CreateUserDto } from './dto/create_user.dto';
import { Body, Delete, Get, Param, Put, UseGuards } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { tokenAuthGuard } from 'src/guard/auth.guard';
import { rolesGuard } from 'src/guard/roles.guard';
import { HashRoles } from 'src/guard/roles.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';


//контроллер запросов в БД пользователя

@ApiTags('Клиенты')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Создаём пользователя' })
    @ApiResponse({ status: 200, type: [User] })
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Получаем всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    // @UseGuards(tokenAuthGuard)
    @HashRoles(Roles.EDITOR, Roles.EDITOR)
    @UseGuards(AuthGuard('jwt'), rolesGuard)

    // @UseGuards(JwtGuard)
    @Get('/all')
    getUsers() {
        return this.usersService.findAllUser()
    }

    @ApiOperation({ summary: 'Удаляем пользователя' })
    @ApiResponse({ status: 200, type: 'ok' })
    @Delete('/:id')
    remove(@Param('id') id: number) {
        return this.usersService.deleteOne(id)
    }

    @ApiOperation({ summary: 'Put users' })
    @Put('/:id')
    updateOne(@Param('id') id: number, @Body() data: User): Promise<any> {
        return this.usersService.updateOne(id, data);
    }

    @ApiOperation({ summary: 'Put users role' })
    @UpdateDateColumn('/role/:id')
    updateRole(@Param('role') role: string, @Body() data: User): Promise<any> {
        return this.usersService.updateRole(role, data);
    }

    @ApiOperation({ summary: 'Находим пользователя по ID' })
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.usersService.findOneByIdUser(id)
    }

    @ApiOperation({ summary: 'Находим пользователя по имени' })
    @Get('/nik/:username')
    getByNickName(@Param('username') username: string) {
        return this.usersService.findOneByNickUser(username)
    }

    @ApiOperation({ summary: 'Находим пользователя по имени' })
    @Get('/mail/:email')
    getByEmail(@Param('email') email: string) {
        return this.usersService.findOneByEmail(email)
    }

}
