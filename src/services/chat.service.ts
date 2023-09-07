import {ChatRoom} from '../entities/chat.entity';
import AppDataSource from '../config/ormconfig';


const chatRepository = AppDataSource.getRepository(ChatRoom);

// Create a new chat
export const createChat = async (chatData: Partial<ChatRoom>) => {
  return (await chatRepository.save(chatRepository.create(chatData))) as ChatRoom;
};

// Find a chat by its ID
export const findChatById = async (chatId: string) => {
  return await chatRepository.findOne({ where: {id: chatId}, 
  relations: [
      "members",
      "messages",
      "messages.sender",
      "messages.receiverRoom"
  ] })
};

// Fetch chats where the user is a member
export const findChatByUserId = async (userId: string) => {
  return await chatRepository
    .createQueryBuilder('chat')
    .innerJoinAndSelect('chat.members', 'member')
    .where('member.id = :userId', { userId: userId })
    .getMany();
}

// Find chats by a specific condition
export const findChats = async (query: Object) => {
  return await chatRepository.find(query);
};

export const deleteChat = async (roomId: string) => {
  return await chatRepository.delete(roomId)
}