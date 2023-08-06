import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";



@Entity()
export class Post extends Model{

	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column("text")
	contentText!: string;

	@OneToMany(() => PostImage, (image) => image.post)
	contentImages!: PostImage[]

	@ManyToOne(() => User, )
	user!: User;
	
	@OneToMany(() => Comment, (comment) => comment.post)
	comments!: Comment[];

	@OneToMany(() => Like, (like) => like.post)
	likes!: Like[]

}


@Entity()
export class PostImage extends Model{

	@PrimaryGeneratedColumn("increment")
	id!: string;

	@ManyToOne(() => Post, (post) => post.contentImages)
	post!: Post;

	@Column()
	url!: string;
	
}


@Entity()
export class Comment extends Model{

	@Column("text")
	content!: string;

	@ManyToOne(() => Post, (post) => post.comments)
	post!: Post;

	@ManyToOne(() => User)
	user!: User;



}


@Entity()
export class Like extends Model{

  @PrimaryGeneratedColumn("increment")
  id!: string;

  @ManyToOne(() => Post, (post) => post.likes)
  post!: Post;

  @ManyToOne(() => User,)
  user!: User;

  @Column("boolean")
  liked!: boolean;

  @Column("timestamp")
  likedAt!: Date;

}


