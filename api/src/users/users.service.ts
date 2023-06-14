import { User, UserResponse, filePath } from 'src/users/users.entity';
import { CONFLICT_ERROR, ERROR, USER_ERROR } from 'config/error.config';
import { DeleteResult, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { Injectable, HttpException, HttpStatus, BadRequestException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap } from 'rxjs';
import { UpdateUserDto } from './dto/update_user.dto';
import * as bcrypt from 'bcrypt';
import { response } from 'express';
import { removeFile } from 'src/files/helpers';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
//__________________________________________________логика методов запросов

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }
    //__________Create_user
    async createUser(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
    //__________Add_AVATAR
    async addAvatar(id: string, profilesImage: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (user.profileImage != filePath) {
            removeFile(user.profileImage);
        }
        const updateUserDto = new UpdateUserDto();
        updateUserDto.profileImage = profilesImage;
        this.userRepository.update(id, updateUserDto);
        return response.status(HttpStatus.OK);
    }
    //____________Find_all_user
    async findAllUser(): Promise<Observable<UserResponse[]>> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (u) {
                    delete u.bantype,
                        delete u.comments,
                        delete u.articles,
                        delete u.password,
                        delete u.createdAt,
                        delete u.lastChangedDateTime
                });
                return users;
            })
        );
    }


    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(function (v) {
                    delete v.bio,
                        delete v.articles,
                        delete v.password,
                        delete v.bantype,
                        delete v.lastChangedDateTime,
                        delete v.isActive
                });
                return usersPageable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: UserResponse): Observable<Pagination<UserResponse>> {
        return from(this.userRepository.findAndCount({
            skip: Number(options.page) * Number(options.limit) || 0,
            take: Number(options.limit) || 10,
            order: { id: "ASC" },
            select: ['id', 'username', 'email', 'role', 'karma', 'banned'],
            where: [
                { username: Like(`%${user.username}%`) }
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<UserResponse> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };
                return usersPageable;
            })
        )
    }
    //___________________Get_ById
    findUserById(id: string) {
        try {
            return from(
                this.userRepository.findOne({
                    where: { id }
                })
            ).pipe(
                map((user: User) => {
                    if (!user) {
                        throw new HttpException(USER_ERROR, HttpStatus.NOT_FOUND);
                    }
                    delete user.favorites;
                    delete user.password;
                    delete user.comments;
                    delete user.password;
                    return user;
                })
            )
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //____________________PROFILE
    findMe(id: string) {
        return from(this.userRepository.findOne({
            where: { id },
            relations: ['favorites', 'articles', 'comments']
        })
        ).pipe(
            map((user: User) => {
                if (!user) {
                    throw new HttpException(USER_ERROR, HttpStatus.NOT_FOUND);
                }
            }))
    }
    //__________________Promise_for_JWT_by_id
    async promiseByIdUser(id: string): Promise<User> {
        try {
            if (!id) {
                throw new BadRequestException(CONFLICT_ERROR);
            }
            return this.userRepository.findOneBy({ id });
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //________________FindOneByName
    async findOneByNickUser(username: string): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ username })
        if (!user) {
            throw new BadRequestException(CONFLICT_ERROR);
        }
        return user;
    }
    //_______________FindOneByEmail
    async findOneByEmail(email: string): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ email })
        return user;
    }
    //_______________Delete user
    //Delete user
    async deleteOne(id: string): Promise<DeleteResult> {
        const user = this.userRepository.findOneBy({ id });
        if ((await user).profileImage != filePath) {
            removeFile((await user).profileImage);
        }
        return this.userRepository.delete(id)
    }
    //________________Role user
    updateRoleOfUser(id: string, user: UserResponse): Observable<any> {
        try {
            return from(this.userRepository.update(id, user));
        } catch (e) {
            throw new BadRequestException('ошибка API');
        }
    }
    //__________________Bio
    findAndUpdateUser(id: string, dto: UpdateUserDto): Observable<any> {
        try {
            return from(this.userRepository.update(id, dto));
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //__________________Pass
    async updateUserPass(user: User, dto: UpdateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 5);
            dto.password = hashedPassword
            return this.findAndUpdateUser(user.id, dto);
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
    //_________________Update_Ban
    updateOne(id: string, user: UserResponse): Observable<UserResponse> {
        try {
            return from(this.userRepository.update(id, user)).pipe(
                switchMap(() => this.findUserById(id))
            );
        } catch (e) {
            throw new BadRequestException(ERROR);
        }
    }
}