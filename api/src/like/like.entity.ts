import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Articles } from 'src/article/article.entity';
import { Comments } from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';


@ApiTags('LIKE')
@Entity({ name: 'vote' })
export class Vote extends BaseEntity {
	constructor(vote: Partial<Vote>) {
		super();
		Object.assign(this, vote);
	}

	@ApiProperty({ example: '1', description: 'уникальный номер' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({ description: 'пользователь' })
	@ManyToOne(() => User, (user) => user.vote,
		{
			onDelete: 'CASCADE', onUpdate: 'CASCADE'
		})
	// @JoinColumn({ name: 'username', referencedColumnName: 'username' })
	user: User;

	@ApiProperty({ description: 'имя пользователя' })
	@Column()
	username: string;

	@ApiProperty({ description: 'пост пользователя' })
	@ManyToOne(() => Articles, (articles) => articles.vote,
		{
			onDelete: 'CASCADE', onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: 'article_id' })
	articles?: Articles;

	@ApiProperty({ description: 'комментарии пользователя' })
	@ManyToOne(() => Comments, (comments) => comments.vote, {
		onDelete: 'CASCADE', onUpdate: 'CASCADE'
	})
	@JoinColumn({ name: 'comment', referencedColumnName: 'comment_id' })
	comment?: Comments;

	@ApiProperty({ description: 'флаг лайка' })
	@Column({ default: 0 })
	value: number;
}
