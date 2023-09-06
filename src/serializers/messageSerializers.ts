import { Message } from "../entities/message.entity";
import { findChatById } from "../services/chat.service";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import SerializerPromise from "./serializerPromise";

export class MessageSerializer extends SerializerPromise<Message, any> {
    
    serializePromise(instance: Message) {
        return {
            "id" : instance.id,
            "sender" : instance.sender,
            "receiverRoom" : instance.receiverRoom,
            "sentAt" : instance.sentAt,
            "content" : instance.content
        }
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