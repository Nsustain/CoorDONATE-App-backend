import { NextFunction, Request, Response, response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { MessageSerializer } from '../serializers/messageSerializers';
import { Message } from '../entities/message.entity';
import { deleteMessage, getMessagesByChatRoomId, sendMessage } from '../services/message.service';


class MessageController {
    private serializer = new MessageSerializer();
    private respository: Repository<Message> = AppDataSource.getRepository(Message);

    public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.serializer.validate(req, res);
            let message = await this.serializer.deserialize(req.body);

            message = await sendMessage(message); 
        } catch(err) {
            next(err)
        }
    };

    public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteMessage(req.body.messageId);
        }catch(err) {
            next(err)
        }
    };

    public getMessagesByChatRoomId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await getMessagesByChatRoomId(req.body.chatRoomId);
        }catch(err) {
            next(err)
        }
    };
}