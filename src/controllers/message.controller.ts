import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Repository } from 'typeorm';
import { MessageSerializer } from '../serializers/messageSerializers';
import { Message } from '../entities/message.entity';
import { deleteMessage, editMessage, findMessageById, getMessagesByChatRoom, saveMessage, searchMessagesInChatRoom } from '../services/message.service';
import { findChatById } from '../services/chat.service';
import AppError from '../utils/appError';


class MessageController {
    private serializer = new MessageSerializer();
    private respository: Repository<Message> = AppDataSource.getRepository(Message);

    public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.serializer.validate(req, res);

            let message = await this.serializer.deserializePromise(req.body);

            let chatRoom = message.receiverRoom

            // check if belong to that chatRoom

            const isMember = chatRoom.members.some(member => member.id === message.sender.id);
            
            if (!isMember) {
                return next(new AppError(403, "User is not a member of the ChatRoom"));
            }

            message = await saveMessage(message); 
            
            return res.status(201).json(this.serializer.serialize(message))

        } catch(err) {
            next(err)
        }
    };

    public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const userId = res.locals.user.id;
            const { messageId } = req.params;

            let message: Message | null = await findMessageById(messageId);

            if(!message) {
                return next(new AppError(404, "Message not found!"));
            }

            if (message.sender.id !== userId) {
                return next(new AppError(401, "You aren't authorized to delete this chat!"));
            } 

            await deleteMessage(messageId);

            return res.status(204).send();

        }catch(err) {
            next(err)
        }
    };

    public editMessage = async (req: Request, res: Response, next: NextFunction) => {

        try {
            
            const { messageId } = req.params;
            const newContent = req.body.content;
            const userId = res.locals.user.id;

            const message = await findMessageById(messageId);
            
            if (!message) {
                return next(new AppError(404, "Message not found!"));
            }
            
            if (message.sender.id !== userId) {
                return next(new AppError(401, "You aren't authorized to delete this chat!"));
            } 
            
            const newMessage = await editMessage(messageId, newContent);
            
            return res.status(200).json(this.serializer.serialize(newMessage));

        }catch(err) {
            next(err);
        }

    }

    public getMessagesByChatRoomId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatRoomId } = req.params;
            // check that the user belong to this chatroom

            // get chatroom object
            const chatRoom = await findChatById(chatRoomId);
            if (!chatRoom) {
                return new AppError(404, "chatroom doesn't exist");
            }

            const messages = await getMessagesByChatRoom(chatRoom);
            
            if (!messages) {
                return res.status(404).json("No messages in this chatroom")
            }

            return res.status(200).json(await this.serializer.serializeMany(messages!))
            
        }catch(err) {
            next(err)
        }
    };

    public searchMessage = async (req: Request, res: Response, next: NextFunction) => {

        try{

            const { chatRoomId }  = req.params
            const { query } = req.query;

            const chatRoom = await findChatById(chatRoomId);

            if (!chatRoom) {
                return next(new AppError(404, "ChatRoom not found"))
            }
            
            // check if the current user is a member
            const isMember = chatRoom.members.some(member => member.id === res.locals.user.id);
            
            if (!isMember) {
                return next(new AppError(403, "User is not a member of the ChatRoom"));
            }


            const matchingMessages = await searchMessagesInChatRoom(chatRoomId, query);

            return res.status(200).json(this.serializer.serializeMany(matchingMessages));

        }catch(err) {
            next(err)
        }
    }
}

export const messageController = new MessageController;
