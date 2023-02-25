// import { User } from 'src/users/users.model';
// import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// @Entity('posts')
// class ArticleEntity {
// 	@PrimaryGeneratedColumn()
// 	public id: number;

// 	@Column()
// 	public title: string;

// 	@Column()
// 	content: string;

// 	@ManyToOne(() => User, (user) => user.article)
// 	author: number;

// 	@CreateDateColumn()
// 	createdAt: Date;

// 	@UpdateDateColumn()
// 	updatedAt: Date;
// }

// export default ArticleEntity;