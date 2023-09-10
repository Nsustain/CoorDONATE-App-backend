import {Message} from '../entities/message.entity';
import AppDataSource from '../config/ormconfig';
import { ChatRoom } from '../entities/chat.entity';

const messageRepository = AppDataSource.getRepository(Message);

export const saveMessage = async (message: Message) => {
    return (await messageRepository.save(messageRepository.create(message))) as Message;
}

export const getMessagesByChatRoom = async (chatRoom: ChatRoom) => {
    let messages = await messageRepository.find({
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
        relations: [
            "sender",
            "receiverRoom"
        ]
});

    return messages
}

export const deleteMessage = async (messageId: string) => {
    return await messageRepository.delete({id: messageId});
}