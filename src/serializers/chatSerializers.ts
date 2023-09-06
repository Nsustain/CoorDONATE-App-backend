import { isGeneratorObject } from "util/types";
import { ChatRoom } from "../entities/chat.entity";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import { MessageSerializer } from "./messageSerializers";
import Serializer from "./serializer";
import UserSerializer from "./userSerializer";
import SerializerPromise from "./serializerPromise";

const messageSerializer = new MessageSerializer();
const userSerializer = new UserSerializer();
export class ChatSerializer extends Serializer<ChatRoom, any> {
    serialize(instance: ChatRoom) {
        return instance.isGroup ?
        {
          "id" : instance.id, 
          "groupName": instance.groupName ? instance.groupName : '',
          "description": instance.description ? instance.description : '',
          "isGroup": instance.isGroup, 
          "groupProfile": instance.groupProfile,
          "groupOwner":  instance.groupOwner ? userSerializer.serialize(instance.groupOwner) : '',
          "members": instance.members ? userSerializer.serializeMany(instance.members) : [],
          "messages": instance.messages ? messageSerializer.serializeMany(instance.messages) : [],
        } : {
          "id" : instance.id, 
          "isGroup": instance.isGroup,
          "members": instance.members ? userSerializer.serializeMany(instance.members) : [],
          "messages": instance.messages ? messageSerializer.serializeMany(instance.messages) : [],
        }
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
        chat.isGroup = data.isGroup;
        // desealizer messages
        chat.messages = []

        if (chat.isGroup){
          chat.description = data.description;
          chat.groupName = data.groupName;
          chat.groupOwner = data.groupOwner;
          chat.groupProfile = data.groupProfile;
        }

        return chat;
      }
}