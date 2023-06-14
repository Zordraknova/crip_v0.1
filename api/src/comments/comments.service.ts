import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CONFLICT_ERROR, STOP_ERROR } from 'config/error.config';
import { Roles, User, UserResponse } from '../users/users.entity';
import { DataSource, Repository, TreeRepository } from 'typeorm';
import { Articles } from 'src/article/article.entity';
import { CommentDto } from './comment.response.dto';
import { Comments } from './comments.entity';

@Injectable()
export class CommentsService {

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		@InjectRepository(Comments)
		private commentRepo: TreeRepository<Comments>,
		@InjectRepository(Articles)
		private articlesRepository: Repository<Articles>,
		@InjectRepository(User)
		private usersRepo: Repository<User>) { }

	//Create___comment
	async createComment(
		user: UserResponse,
		slug: string,
		dto: CommentDto,
	): Promise<Comments[]> {
		let comment = this.commentRepo.create(dto);
		const author: User = await this.usersRepo.findOne({
			where: { id: user.id }
		});
		if (author.banned !== false) {
			throw new BadRequestException(STOP_ERROR);
		}
		const articles = await this.articlesRepository.findOne({
			where: { slug }
		});
		comment.author = author;
		comment.authorName = author.username;
		comment.articles = articles;
		comment.body = dto.body;
		await this.dataSource.manager.save(comment);
		const trees = await this.dataSource.manager.getTreeRepository(Comments).findTrees()
		return trees;
	}
	//Edit___comment
	async editComment(
		id: string,
		data: CommentDto,
		user: User
	) {
		const comment = await this.findCommentById(id);
		if (!comment) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
		const userId = user.id
		const candidat = await this.usersRepo.findOne({ where: { id: userId } })
		const authorId = comment.author.id;
		if (authorId !== candidat.id && candidat.role !== Roles.ADMIN && candidat.role !== Roles.EDITOR) {
			throw new BadRequestException(STOP_ERROR);
		}
		comment.body = data.body;
		await this.commentRepo.update(id, data);
		const trees = await this.dataSource.manager.getTreeRepository(Comments).findTrees()
		return trees;
	}
	//Reply___comment
	async reverseComment(
		id: string,
		slug: string,
		user: User,
		data: CommentDto,
	): Promise<Comments[]> {
		let comment = this.commentRepo.create(data);
		const comment_id = id;
		console.log(' comment_id: ', comment_id);
		const parentComment = await this.commentRepo.findOneBy({ comment_id });
		if (!parentComment) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
		const author = await this.usersRepo.findOne({
			where: { id: user.id },
		});
		if (author.banned !== false) {
			throw new BadRequestException(STOP_ERROR);
		}
		comment.author = author;
		comment.authorName = author.username;
		const articles = await this.articlesRepository.findOne({
			where: {
				slug
			}
		});
		comment.body = data.body;
		comment.articles = articles;
		comment.parent = parentComment;
		await this.dataSource.manager.save(comment);
		const trees = this.dataSource.manager.getTreeRepository(Comments).findTrees({ depth: 2 });
		return trees;
	}

	//Delete___comment
	async deleteComment(id: string, user: UserResponse) {
		const comment = await this.findCommentById(id);
		const ucomId = comment.author.id;
		console.log('comment.author.id: ', comment.author.id);
		const userId = user.id
		const candidat = await this.usersRepo.findOne({ where: { id: userId } })
		console.log('candidat: ', candidat.role);
		if (user.id !== ucomId && candidat.role != Roles.EDITOR && candidat.role != Roles.ADMIN) {
			throw new BadRequestException(STOP_ERROR);
		}
		await this.commentRepo.delete(id);
		return { message: "OK👌" }
	}

	//Find___comment__BY_ID
	async findCommentById(id: string) {
		const comment_id = id;
		const comment = await this.commentRepo.findOne({ where: { comment_id }, relations: ['author', 'vote'] })
		return comment;
	}
	//Find___comment__ALL
	async findAll(slug: string) {
		return await this.dataSource.manager.getTreeRepository(Comments).findRoots();
	}
}
