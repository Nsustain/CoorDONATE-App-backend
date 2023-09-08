import { Server, Socket } from "socket.io";
import AppDataSource from "../config/ormconfig";
import { ChatRoom } from "../entities/chat.entity";
import { Repository } from "typeorm";
import { addMemberToChat, createChat, findChatById, removeMemberFromChat } from "../services/chat.service";
import { findUserById } from "../services/user.service";
import { getMessagesByChatRoom, saveMessage } from "../services/message.service";
import { MessageSerializer } from "../serializers/messageSerializers";
import { Message } from "../entities/message.entity";

class SocketController {
  protected io: Server;
  protected socket!: Socket;
  private isValid: boolean = false;
  private messageSerializer = new MessageSerializer();

  constructor(io: Server) {
    this.io = io;
    io.on('connection', (socket) => {
      console.log('a user connected');
      console.log("id", socket.id);

      // Todo: join default room
      this.socket = socket;
      this.mapEvents();
    });
  }

  private mapEvents() {
    this.socket.on('create', this.createChat.bind(this));
    this.socket.on('join-room', this.joinRoom.bind(this));
    this.socket.on('send-message', this.sendMessage.bind(this));
    this.socket.on('leave-room', this.leaveRoom.bind(this))

  }

  private createChat() {
    // Implement the createChat functionality
  }

  private async joinRoom(data: any) {
    try {
      const { roomId, userId } = data;

      let chat = await findChatById(roomId);


      if (!chat) {
        return this.socket.emit('join-error', { message: "Room Not Found!", roomId: roomId });
      }

      let user = await findUserById(userId);

      if (!user) {
        return this.socket.emit('join-error', { message: "User Not Found!", userId: userId });
      }

      // Todo: authorize the user to join the chat room

      const isMember = chat!.members.some(member => member.id === userId);
      // add the user to that room if the user is not in
      if (!isMember) {
        await addMemberToChat(roomId, user!);
      }

      // send back the chat history
      const chatHistory = await getMessagesByChatRoom(chat!);

      return this.socket.emit('join-success', this.messageSerializer.serializeMany(chatHistory));

    } catch (err) {
      this.socket.emit('join-error', { message: err });
    }
  }

  private async sendMessage(data: any){

    try{
      const { content, roomId, userId } = data;

       const result = await this.validations(roomId, userId)
       
       if (!this.isValid){
        return this.socket.emit('send-error', result)
       }

       const {chat, user} = result

       // store message to db
       const newMessage = new Message();
       newMessage.content = content;
       newMessage.receiverRoom = chat!;
       newMessage.sender = user!;

       await saveMessage(newMessage);

       // send message to other users in that room
       this.socket.to(roomId).emit('receive-message', this.messageSerializer.serialize(newMessage));

       console.log(newMessage)
       return this.socket.emit('send-success')


    }catch(err){
        this.socket.emit('send-error', {
            message: err
        })
    }

  }

  private async leaveRoom (data: any) {

    try {
        const {userId, roomId} = data

        const result = await this.validations(roomId, userId);

        if(!this.isValid) {
            return this.socket.emit('leave-error', result)
        }

        await removeMemberFromChat(roomId, userId);

        return this.socket.to(roomId).emit('left-room', {userId, roomId})

    }catch(err) {

    }
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

