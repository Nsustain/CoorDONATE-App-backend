import { ValidationChain, body } from "express-validator";
import { ChatRoom } from "../entities/chat.entity";
import Serializer from "./serializer";
import { User } from "../entities/user.entity";
import UserSerializer from "./userSerializer";

export class ChatSerializer extends Serializer<ChatRoom, any> {
    serialize(instance: ChatRoom) {
        return {
            "id" : instance.id, 
            "members": instance.members,
            "messages": instance.messages
        };
    }

    deserialize(data: any): ChatRoom {
        let chat = new ChatRoom();
        chat.members = data['members'];
        chat.messages = data['messages']     
        return chat;   
    }
}