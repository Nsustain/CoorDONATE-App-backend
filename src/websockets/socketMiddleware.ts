import { Socket } from "socket.io";
import { verifyJwt } from "../utils/jwt";
import { KeyFunction } from "../utils/keyFactory";
import { findUserById } from "../services/user.service";
import UserSerializer from "../serializers/userSerializer";
import AppError from "../utils/appError";

class SocketMiddleware {
  private socket: Socket;
  private userSerializer: UserSerializer;

  constructor(socket: Socket, next: (err?: Error) => void) {
    this.socket = socket;
    this.userSerializer = new UserSerializer();
    this.decodeUser(next).catch((err: Error) => {
      next(err); // Pass the error to the next middleware or handler
    });
  }

  private async decodeUser(next: (err?: Error) => void) {
    try {
      const { token: accessToken } = this.socket.handshake.auth;

      if (!accessToken) {
        next(new AppError(403, "Auth token not found"));
      }

      // validate the access token
      const decoded = verifyJwt<{ sub: string }>(
        accessToken,
        KeyFunction.access
      );

      if (!decoded) {
        next( new AppError(403, "Invalid token or user doesn't exist"));
      }

      const user = await findUserById(decoded!.sub);

      if (!user) {
        next(new AppError(403, "User not found"));
      }

      this.socket.data.user = this.userSerializer.serialize(user!);
      
      next(); // Proceed to the next middleware or handler
    } catch (err: any) {
      next(err); // Pass the error to the next middleware or handler
    }
  }
}

export default SocketMiddleware;