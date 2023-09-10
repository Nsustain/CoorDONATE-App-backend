export class SocketError extends Error{
    
    constructor(errorType: string, message: string){
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
  }