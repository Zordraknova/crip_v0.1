import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeUpdate,
	BeforeInsert,
	BaseEntity,
	ManyToOne,
	OneToMany,
	Column,
	Entity
} from 'typeorm';
import { Expose, instanceToPlain } from 'class-transformer';
import { User, UserResponse } from 'src/users/users.entity';
import { Comments } from 'src/comments/comments.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import slugify from 'slugify';
import { Vote } from 'src/like/like.entity';
export interface articleResponse {
	id: string;
	slug: string;
	title: string;
	description: string;
	headerImage?: string;
	content: string;
	favoritesCount: number;
	author: UserResponse;
	editor: string;
}

@ApiTags('POST')
@Entity('articles')
export class Articles extends BaseEntity {
	constructor() {
		super();
	}
	@ApiProperty({ example: '1', description: 'уникальный номер ' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column({ nullable: true })
	slug: string;

	@ApiProperty()
	@Column({ nullable: true })
	public title: string;

	@ApiProperty()
	@Column({ default: '  ' })
	description: string;

	@ApiProperty()
	@Column({ nullable: true })
	headerImage?: string;

	@ApiProperty()
	@Column({ nullable: true })
	content: string;

	@ApiProperty()
	@Column('simple-array', { nullable: true })
	tagList: string[];

	@Column({ default: 0 })
	favoritesCount: number;

	@ApiProperty()
	@Column({ nullable: true })
	editor: string;

	@ApiProperty()
	@ManyToOne(() => User, (user) => user.articles)
	author: UserResponse;

	@ApiProperty()
	@OneToMany(type => Comments,
		(comments: Comments) => comments.articles,
		{ eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	public comments: Comments[];
	@Expose()
	get commentNumber(): number {
		return this.comments?.reduce(() => (this.comments.length || 0), 0);
	}

	@ApiProperty({ example: '😗 ', description: 'лайк' })
	// @Exclude()
	@OneToMany(() => Vote, (vote) => vote.articles)
	vote: Vote[];

	@Column({ default: 0 })
	views: number;

	toJSON() {
		return instanceToPlain(this)
	}

	@BeforeInsert()
	generateSlug() {
		this.slug = slugify(this.title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
	}
	@BeforeUpdate()
	updateTimestamp() {
		this.updatedAt = new Date();
	}
	toArticle() {
		const article: any = this.toJSON();
		return { ...article };
	}

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

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn()
	updatedAt: Date;
}