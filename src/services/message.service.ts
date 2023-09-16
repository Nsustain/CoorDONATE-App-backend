import { Message } from '../entities/message.entity';
import AppDataSource from '../config/ormconfig';
import { ChatRoom } from '../entities/chat.entity';
import { FindManyOptions, ILike } from 'typeorm';

const messageRepository = AppDataSource.getRepository(Message);

export const saveMessage = async (message: Message) => {
  return (await messageRepository.save(
    messageRepository.create(message)
  )) as Message;
};

export const getMessagesByChatRoom = async (
  chatRoom: ChatRoom,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  let [messages, totalCount] = await messageRepository.findAndCount({
    join: {
      alias: 'message',
      leftJoinAndSelect: {
        receiverRoom: 'message.receiverRoom',
      },
    },
    where: {
      receiverRoom: {
        id: chatRoom.id,
      },
    },
    relations: ['sender', 'receiverRoom'],
    order: { sentAt: 'DESC' },
    skip,
    take: limit,
  });

  return { messages, totalCount };
};

export const findMessageById = async (messageId: string) => {
  return await messageRepository.findOne({
    where: { id: messageId },
    relations: ['receiverRoom', 'sender'],
  });
};

export const deleteMessage = async (messageId: string) => {
  return await messageRepository.delete({ id: messageId });
};

export const editMessage = async (messageId: string, content: string) => {
  const message = await messageRepository.findOne({
    where: { id: messageId },
    relations: ['receiverRoom', 'sender'],
  });

  if (!message) {
    throw new Error('Message not found');
  }

  message!.content = content;
  return await message.save();
};

export const searchMessagesInChatRoom = async (
  chatRoomId: string,
  query: any
) => {
  return await Message.find({
    where: {
      receiverRoom: { id: chatRoomId },
      content: ILike(`%${query}%`), // Case-insensitive search using ILike
    },
    relations: ['sender', 'receiverRoom'], // Specify the relations to be included in the query result
  } as FindManyOptions<Message>);
};

// get last messsage in chatRoom
export const getLastMessage = async (chatId: string) => {
  const message = await messageRepository
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.sender', 'sender')
    .leftJoinAndSelect('message.receiverRoom', 'receiverRoom')
    .where('message.receiverRoom.id = :chatId', { chatId: chatId })
    .orderBy('message.sentAt', 'DESC')
    .take(1)
    .getOne();

  return message;
};
