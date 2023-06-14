import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { tokenAuthGuard } from 'src/guard/auth.guard';
import { UserDecor } from 'src/users/user.decorator';
import { User } from 'src/users/users.entity';

@ApiTags('Лайки')
@Controller('like')
export class LikeController {
	constructor(private likeService: LikeService) { }
	//__________________________________________________________Article
	@ApiOperation({ summary: 'Лайк_art' })
	@ApiBearerAuth()
	@UseGuards(tokenAuthGuard)
	@Post('/a/up/:slug')
	async postLike(@UserDecor() user: User, @Param('slug') slug: string) {
		return this.likeService.upArt(user, String(slug));
	}

	@ApiOperation({ summary: 'Dизайк_art' })
	@ApiBearerAuth()
	@UseGuards(tokenAuthGuard)
	@Post('/a/down/:slug')
	async postDisLike(@UserDecor() user: User, @Param('slug') slug: string) {
		return this.likeService.downArt(user, String(slug));
	}
	//__________________________________________________________Comments
	@ApiOperation({ summary: 'Лайк_comm' })
	@ApiBearerAuth()
	@UseGuards(tokenAuthGuard)
	@Post('/c/up/:id')
	async comLike(@UserDecor() user: User, @Param('id') id: string) {
		return this.likeService.upCom(user, String(id));
	}

	@ApiOperation({ summary: 'Dизайк_comm' })
	@ApiBearerAuth()
	@UseGuards(tokenAuthGuard)
	@Post('/c/down/:id')
	async comDisLike(@UserDecor() user: User, @Param('id') id: string) {
		return this.likeService.downCom(user, String(id));
	}
}
