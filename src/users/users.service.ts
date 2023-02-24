import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

//__________________________________________________логика методов запросов
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>) { }

    //Create
    async createUser(createUserDto: CreateUserDto) {
        const newUser = await this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
    //FindAll
    async findAllUser() {
        return this.userRepository.find();
    }
    //FindOneById
    async findOneByIdUser(id: number) {
        return this.userRepository.findOneBy({ id });
    }
    //FindOneByName
    async findOneByNickUser(username: string) {
        return this.userRepository.findOneBy({ username });
    }
    //FindOneByEmail
    async findOneByEmail(email: string) {
        return this.userRepository.findOneBy({ email });
    }
    //UpdateId
    async updateOne(id: number, data: User): Promise<any> {
        return this.userRepository.update(id, data);
    }
    //UpdateRole
    async updateRole(role: string, data: User): Promise<any> {
        return this.userRepository.update(role, data);
    }
    //Delete user
    async deleteOne(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }

}


