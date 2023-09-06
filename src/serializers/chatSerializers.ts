import { ChatRoom } from "../entities/chat.entity";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import SerializerPromise from "./serializerPromise";
import { MessageSerializer } from "./messageSerializers";

const messageSerializer = new MessageSerializer();
export class ChatSerializer extends SerializerPromise<ChatRoom, any> {
    serializePromise(instance: ChatRoom) {
        return {
            "id" : instance.id, 
            "members": instance.members,
            "messages": instance.messages ? messageSerializer.serializeManyPromise(instance.messages) : []
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
        const currMessages = await messageSerializer.deserializeManyPromise(data.messages)

        chat.messages = currMessages;
        
        return chat;
      }
}