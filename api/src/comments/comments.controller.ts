import { Controller, Post, Injectable, UseGuards, Body, Req, Param, Delete, Put, Get } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { tokenAuthGuard } from 'src/guard/auth.guard';
import { CommentDto } from './comment.response.dto';
import { UserDecor } from 'src/users/user.decorator';
import { CommentsService } from './comments.service';
import { User } from 'src/users/users.entity';

@ApiTags('Комментарии')
@Injectable()
@Controller('comment')
export class CommentsController {
	constructor(private commentService: CommentsService) {
	}

	@ApiOperation({ summary: 'Комментарий' })
	@ApiConsumes('application/json')
	@UseGuards(tokenAuthGuard)
	@Post('/:slug')
	async createComment(
		@Param('slug') slug: string,
		@Body() data: CommentDto,
		@UserDecor() user: User) {
		return await this.commentService.createComment(user, slug, data,);
	}

	@ApiOperation({ summary: 'Ответ на комментарий' })
	@ApiConsumes('application/json')
	@UseGuards(tokenAuthGuard)
	@Post('/:slug/:id')
	reverseComment(
		@Param('id') id: string,
		@Param('slug') slug: string,
		@Body() data: CommentDto,
		@UserDecor() user: User) {
		return this.commentService.reverseComment(String(id), String(slug), user, data);
	}

	@ApiOperation({ summary: 'Редактировать комментарий' })
	@ApiConsumes('application/json')
	@UseGuards(tokenAuthGuard)
	@Put('/edit/:id')
	async editComment(
		@Param('id') id: string,
		@Body() data: CommentDto,
		@Req() req) {
		const user = req.user;
		console.log('user.id: ', id)
		return await this.commentService.editComment(String(id), data, user);
	}

	@ApiOperation({ summary: 'Удалить комментарий' })
	@Delete('/:id')
	@UseGuards(tokenAuthGuard)
	async delete(@Param('id') id: string, @UserDecor() user: User) {
		return await this.commentService.deleteComment(id, user);
	}

	@ApiOperation({ summary: 'Получить комментарий по id' })
	@Get('/:id')
	async getComments(@Param('id') id: string) {
		return this.commentService.findCommentById(String(id));
	}

	@ApiOperation({ summary: 'Получить ветку' })
	@Get('/all/:slug')
	async getAllComments(@Param('slug') slug: string) {
		return this.commentService.findAll(slug);
	}
}
