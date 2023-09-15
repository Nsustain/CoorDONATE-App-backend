import { Server, Socket } from "socket.io";
import { addMemberToChat, createChat, findChatById, findChatByUserId, removeMemberFromChat } from "../services/chat.service";
import { findUserById } from "../services/user.service";
import { getMessagesByChatRoom, saveMessage } from "../services/message.service";
import { MessageSerializer } from "../serializers/messageSerializers";
import { Message } from "../entities/message.entity";
import UserSerializer from "../serializers/userSerializer";
import { ChatRoom } from "../entities/chat.entity";
import AppDataSource from "../config/ormconfig";
import { ChatSerializer } from "../serializers/chatSerializers";

class SocketController {
  protected io: Server;
  protected socket!: Socket;
  private isValid: boolean = false;
  private messageSerializer = new MessageSerializer();
  private userSerializer = new UserSerializer();
  private chatSerialzier = new ChatSerializer();
  private chatRepository = AppDataSource.getRepository(ChatRoom);
  private userId!: string;

  constructor(io: Server) {
    this.io = io;
    io.on('connection', (socket) => {
  
      // Todo: join default room
      this.socket = socket;
      this.socket.data.auth = false;
      // initialze all rooms for a user
      this.initialize();
      this.mapEvents();
    });
  }

  private mapEvents() {
    this.socket.on('create-room', this.createRoom.bind(this))
    this.socket.on('add-member', this.addMember.bind(this));
    this.socket.on('send-message', this.sendMessage.bind(this));
    this.socket.on('leave-room', this.leaveRoom.bind(this))
  }

  private async initialize() {

    this.userId = this.socket.data.user.id;
    await this.joinRooms()

  }

  private async joinRooms (){
    const allRooms = await findChatByUserId(this.userId);

    if (!allRooms) {
      return;
    }

    allRooms.forEach(room => {
      this.socket.join(room.id.toString())
    });
  }

  private async createRoom(data: any){

      const chat = await this.chatSerialzier.deserializePromise(data);
      const curr_user = await findUserById(this.userId);
      
      // add currUser to chat
      chat.members.push(curr_user!);

      if(chat.members.length != 2 && !chat.isGroup){
        return this.socket.emit('create-error', {
          message: "Can't have move than 2 members in one to one chat!"
        })
      }

      // check if the chat already exists 
      const existingChat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .where('member.id IN (:...memberIds)', { memberIds: chat.members.map(member => member.id) })
      .andWhere('chat.isGroup = :isGroup', { isGroup: chat.isGroup })
      .getOne();

      if (existingChat){
        return this.socket.emit('create-success', {
          chat: this.chatSerialzier.serialize(existingChat)
        })
      }

      let chatDb = await createChat(chat);

      this.socket.emit('create-success', {
        chat: this.chatSerialzier.serialize(chatDb)
      });

  }

// user trying to join a chat room
  private async addMember(data: any) {
    try {
      const { roomId } = data;

      let chat = await findChatById(roomId);

      if (!chat) {
        return this.socket.emit('add-error', { message: "Room Not Found!", roomId: roomId });
      }

      let user = await findUserById(this.userId);

      if (!user) {
        return this.socket.emit('add-error', { message: "User Not Found!", userId: this.userId });
      }

      // Todo: authorize the user to add the chat room

      const isMember = chat!.members.some(member => member.id === this.userId);
      // add the user to that room if the user is not in
      if (!isMember) {
        await addMemberToChat(roomId, user!);
      }

      // send back the chat history
      const chatHistory = await getMessagesByChatRoom(chat!);


      this.socket.emit('add-success', {
        chatHistory: this.messageSerializer.serializeMany(chatHistory)
      });

      const userSerialized = this.userSerializer.serialize(user);
      return this.io.to(roomId).emit('user-joined', {
        user: userSerialized, message: `${user.username} has joined the chatRoom`
      })

    } catch (err) {
      this.socket.emit('add-error', { message: err });
    }
  }

  private async sendMessage(data: any){

    try{
      const { content, roomId} = data;

       const result = await this.validations(roomId, this.userId)
       
       if (!this.isValid){
        return this.socket.emit('send-error', result)
       }

      // Todo: create the chatroom if the two users haven't talked yet  

       const {chat, user} = result

       // store message to db
       const newMessage = new Message();
       newMessage.content = content;
       newMessage.receiverRoom = chat!;
       newMessage.sender = user!;

       await saveMessage(newMessage);

       // send message to other users in that room
       this.socket.to(roomId).emit('receive-message', {
       message: this.messageSerializer.serialize(newMessage)
      });

       return this.socket.emit('send-success')

    }catch(err){
        this.socket.emit('send-error', {
            message: err
        })
    }
  }

  private async leaveRoom (data: any) {

    try {
        const {roomId} = data

        const result = await this.validations(roomId, this.userId);

        if(!this.isValid) {
            return this.socket.emit('leave-error', result)
        }

        await removeMemberFromChat(roomId, this.userId);

        this.socket.to(roomId).emit('left-room', {
          userId: this.userId, roomId: roomId});

        return this.socket.emit('leave-success', {
          message: `${this.userId} has left the room.`
        })

    }catch(err) {
      this.socket.emit('leave-error', {
        message: err
    })
    }
  }

  private disconnect () {

    this.socket.emit('disconnect');
    this.socket.disconnect();
  }


private async validations(roomId: string, userId: string) {
    let chat = await findChatById(roomId);
  
    if (!chat) {
      return { error: { message: "Room Not Found!", roomId: roomId } };
    }
  
    let user = await findUserById(userId);
  
    if (!user) {
      return { error: { message: "User Not Found!", userId: userId } };
    }
  
    const isMember = chat.members.some(member => member.id === user!.id);
  
    if (!isMember) {
      return { error: { message: "User is not a member of this room", userId: userId } };
    }
  
    this.isValid = true;

    return { chat, user };
  }

}

export default SocketController;

