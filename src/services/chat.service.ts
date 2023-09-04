import {ChatRoom} from '../entities/chat.entity';
import AppDataSource from '../config/ormconfig';


const chatRepository = AppDataSource.getRepository(ChatRoom);

// Create a new chat
export const createChat = async (chatData: Partial<ChatRoom>) => {
  return (await chatRepository.save(chatRepository.create(chatData))) as ChatRoom;
};

// Find a chat by its ID
export const findChatById = async (chatId: string) => {
  return await chatRepository.findOneBy({id: chatId});
};

// Find chats by a specific condition
export const findChats = async (query: Object) => {
  return await chatRepository.find(query);
};
