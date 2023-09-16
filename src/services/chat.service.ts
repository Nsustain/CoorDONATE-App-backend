import { ChatRoom } from '../entities/chat.entity';
import AppDataSource from '../config/ormconfig';
import { User } from '../entities/user.entity';
import { Like } from 'typeorm';

const chatRepository = AppDataSource.getRepository(ChatRoom);

// Create a new chat
export const createChat = async (chatData: Partial<ChatRoom>) => {
  return (await chatRepository.save(
    chatRepository.create(chatData)
  )) as ChatRoom;
};

// Find a chat by its ID
export const findChatById = async (chatId: string) => {
  if (!chatId) {
    throw new Error('Chat ID is undefined');
  }

  return await chatRepository.findOne({
    where: { id: chatId },
    relations: [
      'members',
      'groupOwner',
      'messages',
      'messages.sender',
      'messages.receiverRoom',
    ],
  });
};

// Fetch chats where the user is a member
export const findChatByUserId = async (userId: string) => {
  return await chatRepository
    .createQueryBuilder('chat')
    .innerJoinAndSelect('chat.members', 'member')
    .where('member.id = :userId', { userId: userId })
    .getMany();
};

// Find chats by a specific condition

export const filterGroupChats = async (
  searchQuery: string,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;
  const filteredChatRooms = await chatRepository.find({
    where: [
      { groupName: Like(`%${searchQuery}%`), isGroup: true },
      { description: Like(`%${searchQuery}%`), isGroup: true },
    ],
    take: page,
    skip: offset,
  });

  return filteredChatRooms;
};
// Add a member to an existing chat
export const addMemberToChat = async (chatId: string, member: User) => {
  const chat = await chatRepository.findOne({
    where: { id: chatId },
    relations: ['members'],
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  chat.members.push(member);

  return await chatRepository.save(chat);
};

export const removeMemberFromChat = async (
  chatId: string,
  memberId: string
) => {
  const chat = await chatRepository.findOne({
    where: { id: chatId },
    relations: ['members'],
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  const memberIndex = chat.members.findIndex(
    (member) => member.id === memberId
  );

  if (memberIndex === -1) {
    throw new Error('Member not found in the chat');
  }

  chat.members.splice(memberIndex, 1);

  return await chatRepository.save(chat);
};

export const deleteChat = async (roomId: string) => {
  return await chatRepository.delete(roomId);
};
