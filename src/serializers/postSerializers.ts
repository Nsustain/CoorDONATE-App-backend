import { ValidationChain, body } from "express-validator";
import { Post, PostImage } from "../entities/post.entity";
import Serializer from "./serializer";
import { User } from "../entities/user.entity";
import UserSerializer from "./userSerializer";


export class PostImageSerializer extends Serializer<PostImage, string>{
	
	serialize(instance: PostImage): string {
		return instance.url;
	}
	
	deserialize(data: string): PostImage {
		let image = new PostImage();
		image.url = data;
		return image;
	}

}

export class PostSerializer extends Serializer<Post, any>{
	
	private imageSerializer = new PostImageSerializer();
	private userSerializer = new UserSerializer();

	serialize(instance: Post) {
		return {
			"id": instance.id,
			"text": instance.contentText,
			"images": this.imageSerializer.serializeMany(instance.contentImages),
			"likes": instance.likes?.length ?? 0,
			"comments": instance.comments?.length ?? 0,
			"user": this.userSerializer.serialize(instance.postedBy),
		};
	}

	deserialize(data: any): Post {
		let post = new Post();
		post.contentText = data["content_text"];
		post.contentImages = this.imageSerializer.deserializeMany(data.content_images);
		return post;

	}

	protected getValidations(): ValidationChain[] {
		return [
			body("tags").notEmpty(),
			body("content_text").notEmpty(),
			body("content_images").notEmpty()
		]
	}


}