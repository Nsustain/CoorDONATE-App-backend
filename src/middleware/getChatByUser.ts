import { Request, Response, NextFunction } from 'express';
import { Chat } from '../entities/chat.entity'; // Import the Chat entity
import { User } from '../entities/user.entity'; // Import the User entity
import { Repository } from 'typeorm';
import AppDataSource from '../config/ormconfig';

const userRepository = AppDataSource.getRepository(User);
const chatRepository = AppDataSource.getRepository(Chat);

export async function getChatsByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    // Fetch the user based on the provided userId
    const user = await userRepository.findOneBy({id: userId});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch chats where the user is a member
    const chats = await chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.members', 'member')
      .where('member.id = :userId', { userId: user.id })
      .getMany();

    // Attach the chats to res.locals
    res.locals.chats = chats;

    next();
  } catch (error) {
    next(error);
  }
}
