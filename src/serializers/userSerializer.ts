import { User } from "../entities/user.entity";
import Serializer from "./serializer";



export default class UserSerializer extends Serializer<User, any>{
	serialize(instance: User) {
		return {
			"name": instance.name,
			"verified": instance.verified
		}
	}
	deserialize(data: any): User {
		throw new Error("Method not implemented.");
	}

}