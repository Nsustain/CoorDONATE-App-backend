import { Message } from "../entities/message.entity";
import { findChatById } from "../services/chat.service";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import Serializer from "./serializer";

export class MessageSerializer extends Serializer<Message, any> {
    
    serialize(instance: Message) {
        return {
            "id" : instance.id,
            // "sender" : instance.sender.id,
            // "receiverRoom" : instance.receiverRoom.id,
            "sentAt" : instance.sentAt,
            "content" : instance.content
        }
    }

    deserialize(data: any): Message {
		throw new Error("Method not implemented.");
    }

    async deserializePromise(data: any): Promise<Message> {

        // check that chatroom exists
        const recieverChatRoom = await findChatById(data.receiverRoom);
        const sender = await findUserById(data.sender)

        if (!recieverChatRoom){
            throw new AppError(404, "ChatRoom not found");
        }

        if (!sender){
            throw new AppError(404, "Sender user not found")
        }
        

        const message = new Message();
        message.content = data.content,
        message.receiverRoom = recieverChatRoom,
        message.sender = sender

        return message;
    }


}