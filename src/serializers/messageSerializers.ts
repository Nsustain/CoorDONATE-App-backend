import { Message } from "../entities/message.entity";
import { findUserById } from "../services/user.service";
import Serializer from "./serializer";
import { chatController } from "../controllers/chat.controller";

export class MessageSerializer extends Serializer<Message, any> {
    
    serialize(instance: Message) {
        return {
            "id" : instance.id,
            "sender" : instance.sender,
            "receiver" : instance.receiver,
            "sentAt" : instance.sentAt,
            "content" : instance.content
        }
    }

    deserialize(data: any): Message {
        const message = new Message();
        message.content = data.content,
        message.receiver = data.receiver,
        message.sender = data.sender

        return message;
    }


}