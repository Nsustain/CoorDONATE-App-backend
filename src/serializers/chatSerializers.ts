import { ValidationChain, body } from "express-validator";
import { ChatRoom } from "../entities/chat.entity";
import Serializer from "./serializer";
import { User } from "../entities/user.entity";
import UserSerializer from "./userSerializer";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import SerializerPromise from "./serializerPromise";
import { Message } from "../entities/message.entity";

export class ChatSerializer extends SerializerPromise<ChatRoom, any> {
    serializePromise(instance: ChatRoom) {
        return {
            "id" : instance.id, 
            "members": instance.members,
            "messages": instance.messages ? instance.messages : []
        };
    }

    async deserializePromise(data: any): Promise<ChatRoom> {
        const chat = new ChatRoom();
        
        // desealizer users
        const memberIds = data.members;
        const memberPromises = memberIds.map(async (memberId: string) => {
          const member = await findUserById(memberId);
          if (!member) {
            throw new AppError(404, 'User not found');
          }
          return member;
        });
      
        chat.members = await Promise.all(memberPromises);
      
        // desealizer messages
        const currMessages = []
        const date = data.messages

        for (let messageId in data.messages){

            let messageData = data.messages[messageId];
            let newMessage = new Message();
            newMessage.sender = messageData.sender;
            newMessage.receiver = messageData.receiver;
            newMessage.chat = messageData.text;
            
            currMessages.push(newMessage);
        }

        chat.messages = currMessages;
        
        return chat;
      }
}