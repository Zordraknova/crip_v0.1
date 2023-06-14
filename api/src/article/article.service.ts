import { HttpException, HttpStatus, Injectable, BadRequestException, Param } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository, TreeRepository } from 'typeorm';
import { UpdateArticleDto, } from './dto/update_article.dto';
import { CreateArticleDto } from './dto/create_article.dto';
import { User, UserResponse } from 'src/users/users.entity';
import { Comments } from 'src/comments/comments.entity';
import { CONFLICT_ERROR } from 'config/error.config';
import { removeFile } from 'src/files/helpers';
import { Observable, from, map } from 'rxjs';
import { Articles, articleResponse } from './article.entity';
// import slugify from 'slugify';

@Injectable()
export class ArticleService {
	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		@InjectRepository(Articles)
		private articlesRepository: Repository<Articles>,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		@InjectRepository(Comments)
		private readonly commentRepo: TreeRepository<Comments>
	) { }

	//______________________________________________________________CREATE_ARTICLE
	createArticle(user: UserResponse, file, dto: CreateArticleDto): Observable<Articles> {
		try {
			const articles = this.articlesRepository.create(dto);
			articles.author = user;
			if (!articles.tagList) {
				articles.tagList = [];
			}
			console.log('Param: ', Param);
			if (file != null) {
				articles.headerImage = file;
			}
			return from(this.articlesRepository.save(articles));
		} catch (e) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
	}
	//______________________________________________________________FIND_BY_ID
	public findOne(id: string): Observable<articleResponse> {

		return from(
			this.articlesRepository.findOne({
				where: {
					id: id,
					comments: {
						parent: IsNull()
					}
				},
				relations: ['comments', 'author', 'vote', 'comments.children'],
			})
		);

	}
	//______________________________________________________________FIND_BY_SLUG
	async findBySlug(slug: string): Promise<Articles> {
		try {
			const article = await this.articlesRepository.findOne({
				where: { slug },
				select: {
					author: {
						id: true,
						username: true,
						profileImage: true,
					}
				},
				relations: ['comments', 'author', 'vote', 'comments.children'],
			})
			article.views++;
			article.save();
			return article.toArticle()//_______
		} catch (e) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
	};
	//______________________________________________________________FIND_ALL_POST
	findAllArticles(): Observable<Articles[]> {
		return from(this.articlesRepository.find({
			order: {
				createdAt: 'DESC',
			},
			relations: ['vote']
		})).pipe(
			map((articles: Articles[]) => {
				articles.forEach(function (v) { delete v.comments, delete v.editor });
				return articles;
			})
		);
	}
	//______________________________________________________________UPDATE_ARTICLE
	async updateArticle(id: string, user: UserResponse, file, dto: UpdateArticleDto) {
		try {
			const article = await this.articlesRepository.findOneBy({ id });

			if (!article) {
				throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND);
			}
			const one = article.headerImage;
			if (!file) {
				true;
			} else {
				if (one != null) {
					removeFile(one);
					dto.headerImage = file;
				}
			}
			dto.editor = user.id;
			this.articlesRepository.update(article.id, dto);

			return this.findBySlug(article.slug);
		} catch (e) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
	}
	//______________________________________________________________DELETE_POST
	async deleteOne(id: string) {
		try {
			const article = this.articlesRepository.findOneBy({ id });
			const img = (await article).headerImage;
			console.log('img: ', img);
			if (img != null) {
				removeFile(img);
			}
			this.articlesRepository.delete(id);
			return { message: "удалено" }
		} catch (e) {
			return BadRequestException;
		}
	}
	//______________________________________________________________Добавить в сохранённые
	async addArticleToFavorites(
		slug: string,
		id: string,
	): Promise<Articles> {
		const article = await this.findBySlug(slug);
		const user = await this.userRepo.findOne({
			where: { id },
			relations: ['favorites']
		});
		const isNotFavorited =
			user.favorites.findIndex(
				(articleInFavorites) => articleInFavorites.id === article.id,
			) === -1;

		if (isNotFavorited) {
			user.favorites.push(article);
			article.favoritesCount++;
			article.views++;
			await this.userRepo.save(user);
			await this.articlesRepository.save(article);
		}
		return article;
	}
	//______________________________________________________________Удалить из сохранённых
	async deleteArticleFromFavorites(
		slug: string,
		id: string,
	): Promise<Articles> {
		const article = await this.findBySlug(slug);
		const user = await this.userRepo.findOne({
			where: { id },
			relations: ['favorites']
		});
		const articleIndex = user.favorites.findIndex(
			(articleInFavorites) => articleInFavorites.id === article.id,
		);
		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1);
			article.favoritesCount--;
			await this.userRepo.save(user);
			await this.articlesRepository.save(article);
		}
		return article;
	}
	//______________________________________________________________Promise find by id
	async findPromiseId(id: string): Promise<Articles> {
		const articles = await this.articlesRepository.findOneBy({ id });
		articles.views++;
		articles.save();
		return articles;

	}

}