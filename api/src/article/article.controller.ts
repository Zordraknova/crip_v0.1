import { Body, Controller, Get, Param, Post, UseGuards, Delete, HttpException, HttpStatus, Patch, UseInterceptors, UploadedFile, HttpCode, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles, User, UserResponse } from 'src/users/users.entity';
import { CreateArticleDto } from './dto/create_article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsCreatorGuard } from 'src/guard/isAuthor.guard';
import { HashRoles } from 'src/guard/roles.decorator';
import { tokenAuthGuard } from 'src/guard/auth.guard';
import { Articles } from 'src/article/article.entity';
import { UserDecor } from 'src/users/user.decorator';
import { ArticleService } from './article.service';
import { RolesGuard } from 'src/guard/roles.guard';
import { ImagePipe } from 'src/files/image.pipe';
import { Observable, from, of } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@ApiTags('Посты')
@Controller('article')
export class ArticleController {
	constructor(private articleService: ArticleService, private usersService: UsersService) { }
	//______________________________________________________
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Создаём пост' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				content: { type: 'string' },
				description: { type: 'string' },
				tagList: { type: 'string' },
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		}
	})
	//______________________________________________________
	@HashRoles(Roles.ADMIN, Roles.AUDITOR, Roles.EDITOR)
	@UseGuards(RolesGuard)
	@Post('/review')
	@HttpCode(201)
	@UseInterceptors(FileInterceptor('file'))
	create(
		@UploadedFile(ImagePipe) file: Express.Multer.File,
		@Body() dto: CreateArticleDto,
		@UserDecor() user: UserResponse) {
		console.log('file: controller ', file);
		return this.articleService.createArticle(user, file, dto);

	}
	//______________________________________________________
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Редактируем пост' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				content: { type: 'string' },
				description: { type: 'string' },
				tagList: { type: 'string' },
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		}
	})
	@UseGuards(tokenAuthGuard, IsCreatorGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Patch('/:id')
	async update(
		@Param('id') id: string,
		@UploadedFile(ImagePipe) file: Express.Multer.File,
		@Body() dto: CreateArticleDto,
		@Req() req) {
		const user: User = req.user
		const userName = this.usersService.findUserById(user.id);
		if (!file) {
			file = null
		}
		return this.articleService.updateArticle(id, user, file, dto);
	}
	//______________________________________________________
	@ApiOperation({ summary: 'Получаем все cтатьи' })
	@ApiResponse({ status: 200, type: [Articles] })
	@Get('/all')
	getArticles() {
		console.log('getArticles: ');
		return this.articleService.findAllArticles();
	}
	//______________________________________________________
	@ApiOperation({ summary: 'Получаем статью по slug' })
	@ApiResponse({ status: 200, type: [Articles] })
	@Get('/slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		const article = await this.articleService.findBySlug(slug);
		return article;
	}
	//______________________________________________________
	@ApiOperation({ summary: 'Получаем статью по ID' })
	@ApiResponse({ status: 200, type: [Articles] })
	@Get(':id')
	getById(@Param('id') id: string) {
		const article = this.articleService.findPromiseId(id);
		return article;
	}
	//______________________________________________________
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Удаляем cтатью' })
	@ApiResponse({ status: 200, type: [Articles] })
	@UseGuards(tokenAuthGuard, IsCreatorGuard)
	@Delete(':id')
	deleteOne(@Param('id') id: string): Observable<any> {
		try {
			return from(this.articleService.deleteOne(id));
		} catch (e) {
			throw new HttpException('Ошибка поиска файла', HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
	//______________________________________________________
	@ApiBearerAuth()
	@ApiOperation({ summary: 'cохранить пост' })
	@ApiUnauthorizedResponse()
	@Post('/favor/:slug')
	@UseGuards(tokenAuthGuard)
	async addArticleToFavorites(
		@UserDecor('user') user: User,
		@Param('slug') slug: string,
	): Promise<Articles> {
		console.log(slug, 'slug')
		const article = await this.articleService.addArticleToFavorites(
			slug,
			user.id
		);
		console.log(article, 'article')
		return this.articleService.findBySlug(slug);
	}
	//______________________________________________________
	@ApiBearerAuth()
	@ApiOperation({ summary: 'удалить пост из сохранёных' })
	@ApiUnauthorizedResponse()
	@Delete('/favor/:slug')
	@UseGuards(tokenAuthGuard)
	async deleteArticleFromFavorites(
		@UserDecor('user') user: User,
		@Param('slug') slug: string,
	): Promise<Articles> {
		const article = await this.articleService.deleteArticleFromFavorites(
			slug,
			user.id,
		);
		return this.articleService.findBySlug(slug);
	}

}

