import {Message} from '../entities/message.entity';
import AppDataSource from '../config/ormconfig';

const messageRepository = AppDataSource.getRepository(Message);

export const sendMessage = async (message: Partial<Message>) => {
    return (await messageRepository.save(messageRepository.create(message)))as Message;
}

export const getMessagesByChatRoomId = async (chatRoomId: string) => {
    return await messageRepository.findOneBy({receiver: chatRoomId});
}

export const deleteMessage = async(messageId: string) => {
    return await messageRepository.delete({id: messageId});
}