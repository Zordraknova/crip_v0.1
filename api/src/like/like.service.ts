import { Vote } from './like.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONFLICT_ERROR } from 'config/error.config';
import { Articles } from 'src/article/article.entity';
import { Comments } from 'src/comments/comments.entity';
import { User, UserResponse } from 'src/users/users.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LikeService {
	constructor(
		@InjectRepository(Articles)
		private articlesRepository: Repository<Articles>,
		@InjectRepository(User)
		private userRepo: Repository<User>,
		@InjectRepository(Vote)
		private voteRepo: Repository<Vote>,
		@InjectRepository(Comments)
		private commentRepo: Repository<Comments>,
	) { }

	async upArt(user: UserResponse, slug: string) {
		if (slug) {
			let vote: Vote | undefined;
			const candidat = await this.userRepo.findOneBy({ id: user.id });
			const articles = await this.articlesRepository.findOne({ where: { slug }, relations: ['vote', 'author'] });
			if (!articles) {
				throw new BadRequestException(CONFLICT_ERROR);
			}
			console.log('candidat.username: ', candidat);

			const userID = user.id;
			const articlesID = articles.id;
			vote = await this.voteRepo
				.createQueryBuilder('vote')
				.leftJoinAndSelect('vote.articles', 'articles')
				.leftJoinAndSelect('vote.user', 'user')
				.where(`articles.id = :articlesID`, { articlesID })
				.where(`user.id = :userID`, { userID })
				.getOne();

			console.log('vote: ', vote);
			if (!vote) {
				let vote: Vote = this.voteRepo.create(Vote);
				vote.user = candidat;
				vote.value = Number(1);
				vote.username = candidat.username;
				vote.articles = articles;
				const author = articles.author;
				author.karma++;
				this.userRepo.save(author);
				await this.voteRepo.create(vote).save();
			} else if (vote.value == 0) {
				await vote.remove()
			} else if (vote.value !== 1) {
				vote.value++;
				await vote.save();
			}
			articles.setUserVote(candidat);
			return await this.articlesRepository.findOne({ where: { slug }, relations: ['vote', 'author'] });
		} else {
			throw new BadRequestException(CONFLICT_ERROR);
		}

	}

	async downArt(user: UserResponse, slug: string) {
		if (slug) {
			let vote: Vote | undefined;

			const candidat = await this.userRepo.findOne({ where: { id: user.id } });
			const articles = await this.articlesRepository.findOne({ where: { slug }, relations: ['vote', 'author'] });
			if (!articles) {
				throw new BadRequestException(CONFLICT_ERROR);
			}

			const userID = user.id;
			const articlesID = articles.id;
			vote = await this.voteRepo
				.createQueryBuilder('vote')
				.leftJoinAndSelect('vote.articles', 'articles')
				.leftJoinAndSelect('vote.user', 'user')
				.where(`articles.id = :articlesID`, { articlesID })
				.where(`user.id = :userID`, { userID })
				.getOne();

			if (!vote) {
				let vote: Vote = this.voteRepo.create(Vote);
				vote.user = candidat;
				vote.value = Number(-1);
				vote.username = candidat.username;
				vote.articles = articles;
				const author = articles.author;
				author.karma--;
				this.userRepo.save(author);
				await this.voteRepo.create(vote).save();
			} else if (vote.value == 0) {
				await vote.remove()
			} else if (vote.value !== -1) {
				vote.value--;
				await vote.save();
			}
			articles.setUserVote(candidat);
			return await this.articlesRepository.findOne({ where: { slug }, relations: ['vote', 'author'] });
		} else {
			throw new BadRequestException(CONFLICT_ERROR);
		}
	}

	async upCom(user: UserResponse, id: string) {

		let vote: Vote | undefined;
		const candidat = await this.userRepo.findOne({ where: { id: user.id } });
		const comment = await this.commentRepo.findOne({ where: { comment_id: id }, relations: ['vote', 'author'] });
		console.log('comment: ', comment);
		if (!comment) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
		const userID = user.id;
		console.log('user.id: ', user.id);
		const commentID = id;

		vote = await this.voteRepo
			.createQueryBuilder('vote')
			.leftJoinAndSelect('vote.comment', 'comment')
			.leftJoinAndSelect('vote.user', 'user')
			.where(`comment.id = :commentID`, { commentID })
			.where(`user.id = :userID`, { userID })
			.getOne();
		console.log('vote: ', vote);


		if (!vote) {
			let vote: Vote = this.voteRepo.create(Vote);
			vote.user = candidat;
			vote.value = Number(+1);
			vote.username = candidat.username;
			vote.comment = comment;
			const author = comment.author;
			author.karma++;
			this.userRepo.save(author);
			await this.voteRepo.create(vote).save();
		} else if (vote.value == 0) {
			await vote.remove()
		} else if (vote.value !== +1) {
			vote.value++;
			await vote.save();
		}
		comment.setUserVote(candidat);
		return await this.commentRepo.findOne({ where: { comment_id: id }, relations: ['vote', 'author'] });
	}

	async downCom(user: UserResponse, id: string) {
		let vote: Vote | undefined;
		const candidat = await this.userRepo.findOne({ where: { id: user.id } });
		const comment = await this.commentRepo.findOne({ where: { comment_id: id }, relations: ['vote', 'author'] });
		if (!comment) {
			throw new BadRequestException(CONFLICT_ERROR);
		}
		const userID = user.id;
		const commentID = id;

		vote = await this.voteRepo
			.createQueryBuilder('vote')
			.leftJoinAndSelect('vote.comment', 'comment')
			.leftJoinAndSelect('vote.user', 'user')
			.where(`comment.id = :commentID`, { commentID })
			.where(`user.id = :userID`, { userID })
			.getOne();


		if (!vote) {
			let vote: Vote = this.voteRepo.create(Vote);
			vote.user = candidat;
			vote.value = Number(-1);
			vote.username = candidat.username;
			vote.comment = comment;
			const author = comment.author;
			author.karma--;
			this.userRepo.save(author);
			await this.voteRepo.create(vote).save();
		} else if (vote.value == 0) {
			await vote.remove()
		} else if (vote.value !== -1) {
			vote.value--;
			await vote.save();
		}
		comment.setUserVote(candidat);
		return await this.commentRepo.findOne({ where: { comment_id: id }, relations: ['vote', 'author'] });
	}
}
