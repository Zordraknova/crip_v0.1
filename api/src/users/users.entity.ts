import { path } from 'app-root-path';
import { ApiProperty } from '@nestjs/swagger';
import { Articles } from 'src/article/article.entity';
import { Comments } from 'src/comments/comments.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsLowercase, IsOptional, Max, Min } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  JoinTable,
  ManyToMany
} from 'typeorm';
import { Vote } from 'src/like/like.entity';

//______________________________Модель таблицы пользователя

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  EDITOR = 'editor',
  AUDITOR = 'auditor'
}
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  bio: string;
  profileImage: string;
  role: Roles;
  banned: boolean;
  karma: number;
}

//__________________path_upload_____________________________________
export const filesPath = `${path}/public/profile-pix.png`;
export const filePath = filesPath.replace(/\\/g, '/');
//______________////______________////______________////______________////______________////______________//
@Entity('users')
export class User extends BaseEntity {

  //iD____
  @ApiProperty({ example: '1', description: 'уникальный номер пользователя' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //Avatar_user__
  @ApiProperty({ description: 'аватар пользователя' })
  @Column({ nullable: true, default: filePath })
  profileImage: string;

  //Name____
  @ApiProperty({ example: 'Jane Doe', description: 'имя пользователя' })
  @Min(2)
  @Max(30)
  @Column({ length: 30, unique: true })
  username: string;

  //Email____
  @ApiProperty({ example: 'user@postmail.com', description: 'почтовый адрес' })
  @Transform(({ value }) => value.toLowerCase())
  @Column({ type: 'varchar', unique: true, length: 20, nullable: false })
  email: string;

  //Password__
  @ApiProperty({ example: '1234AaBb', description: 'Пароль' })
  @Column({ nullable: false })
  password: string;

  //Active____
  @ApiProperty({ example: 'true', description: 'активность пользователя' })
  @Column({ default: true })
  isActive: boolean;

  // Bio______
  @ApiProperty({ example: 'In vina veritas', description: 'статус пользователя' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  bio: string | null;

  // Ban______
  @ApiProperty({ example: 'false', description: ',ban пользователя' })
  @Column({ default: false })
  banned: boolean;

  // BanReasons_____
  @ApiProperty({ example: 'Расжигание костра', description: 'причина бана' })
  @Column({ type: 'varchar', nullable: true })
  bantype: string | null;

  //Time____
  @ApiProperty({ example: '2023-02-09T13:57:59', description: 'дата создания' })
  @CreateDateColumn({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  //Time____
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  //Role____
  @ApiProperty({ example: 'MODERATOR', description: 'роль пользователя' })
  @IsLowercase()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER
  })
  role: Roles;

  //Karma____
  @ApiProperty({ description: 'карма пользователя' })
  @Exclude()
  @Column({ default: 0 })
  karma: number;

  //Post_article
  @ApiProperty({ example: '"Послание Филистимлянам"', description: 'посты' })
  @Exclude()
  @OneToMany(() => Articles, (articles: Articles) => articles.author,
    { eager: true })
  @JoinColumn({
    name: "articlesID",
    referencedColumnName: "id"
  })
  articles: Articles[];

  //Comments_article
  @ApiProperty({ example: '"Добрый вечер"', description: 'комментарии' })
  @ApiProperty()
  @Exclude()
  @OneToMany(type => Comments,
    (comment: Comments) => comment.author)
  comments: Comments[];

  // ___likes
  @ApiProperty({ example: '😗 ', description: 'лайк' })
  @OneToMany(() => Vote, (vote: Vote) => vote.user)
  vote: Vote[];

  //____favorites_post
  @ApiProperty({ description: 'сохранённые статьи' })
  @ManyToMany(type => Articles)
  @JoinTable()
  favorites: Articles[]
  static username: any;

  @BeforeInsert()
  userNames() {
    this.username = 'user' + '_' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
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
}