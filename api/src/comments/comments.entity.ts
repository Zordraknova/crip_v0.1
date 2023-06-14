import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { User, UserResponse } from 'src/users/users.entity';
import { Articles } from './../article/article.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Tree,
	TreeChildren,
	TreeParent,
	UpdateDateColumn
} from 'typeorm';
import { Vote } from 'src/like/like.entity';

export interface commentResponse {
	id: string;
	body: string;
	author: UserResponse;
	authorName: string;
	createdAt: string | Date;
	parent?: string | null;
}

@ApiTags('Comment')
@Tree('adjacency-list')
@Entity({ name: 'comments' })
export class Comments extends BaseEntity {
	constructor() {
		super();
	}

	@PrimaryGeneratedColumn('uuid')
	comment_id: string;

	@ApiProperty()
	@ManyToOne(() => User, user => user.comments)
	@JoinColumn({ name: 'user_id' })
	author: User;

	@Exclude()
	@ManyToOne(() => Articles, (articles) => articles.comments,
		{
			onDelete: 'CASCADE', onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: 'article_id' })
	public articles: Articles;

	@Expose({ groups: ['comment-list'] })
	@TreeParent()
	public parent: Comments;

	@Expose({ groups: ['comment-tree'] })
	@TreeChildren({ cascade: true })
	public children: Comments[];

	@ApiProperty()
	@Column()
	body: string;

	@ApiProperty()
	@Column()
	authorName: string;

	@ApiProperty({ example: '😗 ', description: 'лайк' })
	@OneToMany(type => Vote, (vote) => vote.comment,
		{ eager: true })
	vote: Vote[];

	toJSON() {
		return <Comments>instanceToPlain(this)
	}

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn()
	updatedAt: Date;
	//_________________________________________________________________________________
	@Expose()
	get voteScore(): number {
		return this.vote?.reduce((prev, curr) => prev + (curr.value || 0), 0);
	}

	protected userVote: number;
	setUserVote(user: User) {
		const index = this.vote?.findIndex((l) => l.username === user.username);
		this.userVote = index > -1 ? this.vote[index].value : 0;
	}
	//___________________________________________________________________________________
}