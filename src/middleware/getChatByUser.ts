import { Request, Response, NextFunction } from 'express';
import { ChatRoom } from '../entities/chat.entity'; // Import the Chat entity
import { User } from '../entities/user.entity'; // Import the User entity
import AppDataSource from '../config/ormconfig';
import AppError from '../utils/appError';
import { findChatByUserId } from '../services/chat.service';

const userRepository = AppDataSource.getRepository(User);
const chatRepository = AppDataSource.getRepository(ChatRoom);

export async function getChatsByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    // check authority
    if (userId !== res.locals.user.id.toString()){
      return next(new AppError(401, "You are not authorized to view this chats."))
    }

    // Fetch the user based on the provided userId
    const user = await userRepository.findOneBy({id: userId});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch chats where the user is a member
    const chats = findChatByUserId(user.id, 1, 1)
    // Attach the chats to res.locals
    res.locals.chats = chats;

    next();
  } catch (error) {
    next(error);
  }
}
