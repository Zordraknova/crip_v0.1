import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, Entity, Column, PrimaryGeneratedColumn, Table, ManyToMany, UpdateDateColumn, JoinTable, BaseEntity, OneToMany } from 'typeorm';

//______________________________Модель таблицы пользователя
export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  EDITOR = 'editor',
}

@Entity('users')
export class User extends BaseEntity {

  iD____
  @ApiProperty({ example: '1', description: 'уникальный номер пользователя' })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  //Name____
  @ApiProperty({ example: 'Jane Doe', description: 'имя пользователя' })
  @Column({ length: 20, type: 'varchar', default: 'User' })
  username: string;

  //Email____
  @ApiProperty({ example: 'user@postmail.com', description: 'почтовый адрес' })
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
  @Column({ type: 'varchar', nullable: true })
  bio: string | null;;

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

  //Post
  // @OneToMany(() => ArticleEntity, (articles) => articles.author)
  // article: ArticleEntity[];

  //Role____
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER
  })
  role: Roles[]
}