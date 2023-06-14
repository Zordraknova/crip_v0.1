import { BadRequestException, Controller, Res, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Put, UseGuards, Injectable, Req, Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, User, UserResponse, filePath } from './users.entity';
import { UpdateUserDto } from 'src/users/dto/update_user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { tokenAuthGuard } from 'src/guard/auth.guard';
import { CreateUserDto } from './dto/create_user.dto';
import { HashRoles } from 'src/guard/roles.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolesGuard } from 'src/guard/roles.guard';
import { SharpPipe } from 'src/files/avatar.pipe';
import { Observable, from, map, of } from 'rxjs';
import { UsersService } from './users.service';
import { UserDecor } from './user.decorator';
import { ERROR } from 'config/error.config';
import { path } from 'app-root-path';
import { response } from 'express';

//__path_upload_image
const filesPath = `${path}/uploads/profileimages`
const filedPath = filesPath.replace(/\\/g, '/');
//контроллер запросов в БД пользователя

@ApiTags('Пользователи')
@Controller('users')
@Injectable()
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }
    //______________________________________________________Создаём пользователя
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }
    // ______________________________________________________Обновить роли пользователя_________________________________
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'Обновить роли пользователя' })
    @HashRoles(Roles.ADMIN)
    @UseGuards(RolesGuard)
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.usersService.updateRoleOfUser(String(id), user);
    }
    //______________________________________________________Аватар пользователя
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        }
    })
    @ApiOperation({ summary: 'загрузить аватар пользователя' })
    @Post('/avatar')
    @UseGuards(tokenAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile(SharpPipe) file: Express.Multer.File, @UserDecor() user: UserResponse) {
        try {
            console.log(user)
            const id = user.id
            const profilesImage = `${filedPath}/${file}`;
            return this.usersService.addAvatar(id, profilesImage);
        }
        catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //____________________________________________Все пользователи
    @ApiBearerAuth()
    // @UseGuards(tokenAuthGuard)
    @ApiOperation({ summary: 'Получаем всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    // @HashRoles(Roles.ADMIN, Roles.AUDITOR)
    // @UseGuards(RolesGuard)
    // @Get('/all')
    // getUsers() {
    //     return this.usersService.findAllUser();
    // }
    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<UserResponse>> {
        limit = limit > 100 ? 100 : limit;

        return this.usersService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/users' });

    }

    //_________________________________________________Бан пользователя_________________________________
    @ApiBearerAuth()
    @ApiOperation({ summary: 'бан пользователя' })//__________________________________
    @HashRoles(Roles.ADMIN, Roles.AUDITOR)
    @UseGuards(RolesGuard)
    @Patch('/ban/:id')
    banOne(@Param('id') id: string, @Body() data: UserResponse) {
        try {
            this.usersService.updateOne(id, data);
            return response.status(HttpStatus.OK);
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //______________________________________________________Имя пользователя
    @ApiOperation({ summary: 'обновить имя пользователя' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @UseGuards(tokenAuthGuard)
    @Put('/update/name')
    updateUserName(@UserDecor('user') user: UserResponse, @Body() dto: UpdateUserDto) {
        console.log('user: ', user);
        try {
            this.usersService.findAndUpdateUser(user.id, dto);
            return response.status(HttpStatus.OK);
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //______________________________________________________Статус пользователя
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'обновить статус пользователя' })
    @UseGuards(tokenAuthGuard)
    @Put('/update/bio')
    updateUser(@UserDecor('user') user: UserResponse, @Body() dto: UpdateUserDto) {
        try {
            this.usersService.findAndUpdateUser(user.id, dto);
            return response.status(HttpStatus.OK);
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //______________________________________________________Пароль пользователя
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiOperation({ summary: 'обновить пароль пользователя' })
    @UseGuards(tokenAuthGuard)
    @Put('/update/pass')
    updatePass(@UserDecor('user') user: User, @Body() dto: UpdateUserDto) {
        try {
            this.usersService.updateUserPass(user, dto);
            return response.status(HttpStatus.OK);
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //______________________________________________________
    @ApiOperation({ summary: 'Находим пользователя по ID' })
    @Get('/:id')
    getById(@Param('id') id: string): Observable<User> {
        return from(this.usersService.findUserById(id));
    }
    //______________________________________________________
    @ApiOperation({ summary: 'Находим пользователя по ID' })
    @UseGuards(tokenAuthGuard)
    @Get('/me/:id')
    getMe(@Req() req) {
        const id = req.user.id;
        return from(this.usersService.promiseByIdUser(String(id)));
    }
    //______________________________________________________
    @ApiOperation({ summary: 'Находим пользователя по имени' })
    @Get('/nik/:username')
    getByNickName(@Param('username') username: string): Observable<User> {
        return from(this.usersService.findOneByNickUser(username));
    }
    //______________________________________________________
    @ApiOperation({ summary: 'Находим пользователя по email' })
    @Get('/mail/:email')
    getByEmail(@Param('email') email: string): Observable<User> {
        return from(this.usersService.findOneByEmail(email));
    }
    //______________________________________________________
    @ApiOperation({ summary: 'получить аватар пользователя' })
    @Get('ava/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        if (imagename != 'profile-pix.png') {
            return of(res.sendFile(`${filedPath}/${imagename}`));
        } else {
            return of(res.sendFile(`${filePath}`))
        }
    }
    //______________________________________________________
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удаляем пользователя' })
    @ApiResponse({ status: 200, type: 'ok' })
    @UseGuards(tokenAuthGuard)
    @Delete('/:id')
    remove(@Param('id') id: string, @UserDecor('id') user: UserResponse) {
        try {
            this.usersService.deleteOne(id);
            return response.status(HttpStatus.OK).json(
                'пользователь удалён!'
            )
        } catch (e) {
            throw new HttpException(new Error(ERROR), HttpStatus.BAD_REQUEST);
        }
    }
}
