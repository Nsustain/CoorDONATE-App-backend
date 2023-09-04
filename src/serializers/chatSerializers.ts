import { ValidationChain, body } from "express-validator";
import { Chat } from "../entities/chat.entity";
import Serializer from "./serializer";
import { User } from "../entities/user.entity";
import UserSerializer from "./userSerializer";

export class ChatSerializer extends Serializer<Chat, any> {
    serialize(instance: Chat) {
        return {
            "id" : instance.id, 
            "members": instance.members,
            "messages": instance.messages
        };
    }

    deserialize(data: any): Chat {
        let chat = new Chat();
        chat.id = data["id"];
        chat.members = data['members'];
        chat.messages = data['messages']     
        return chat;   
    }
}