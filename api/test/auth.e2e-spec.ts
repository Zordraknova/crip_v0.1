import { CreateUserDto } from './../src/users/dto/create_user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Post } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { } from "@nestjs/typeorm";

const userDto: CreateUserDto = {
	email: 'user1@mail.com',
	password: 'AaQwery123'
}

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let token: string;
	let id: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/registration')
			.send(userDto);
		token = body.token
	});

	it('/auth/registration (POST)-succes', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/registration')
			.send(userDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				id = body._id;
				expect(id).toBeDefined()
				done()

			})

		// afterAll(()=>{disconnect})
	});
});