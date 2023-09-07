import { ChatRoom } from "../entities/chat.entity";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import { MessageSerializer } from "./messageSerializers";
import Serializer from "./serializer";
import UserSerializer from "./userSerializer";

const messageSerializer = new MessageSerializer();
const userSerializer = new UserSerializer();
export class ChatSerializer extends Serializer<ChatRoom, any> {
    serialize(instance: ChatRoom) {
        return {
            "id" : instance.id, 
            "members": instance.members ? userSerializer.serializeMany(instance.members) : [],
            "messages": instance.messages ? messageSerializer.serializeMany(instance.messages) : [],
        };
    }

    deserialize(data: any): ChatRoom {
		  throw new Error("Method not implemented.");
      
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
        chat.messages = []
        
        return chat;
      }
}