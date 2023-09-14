import multer from "multer";
import { Response, Request } from "express";
import AppError from "./appError";

const multarError = (error: any, req: Request, res: Response) => {

if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new AppError(400, "File is too large.")
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return new AppError(400, "File limit reached.")
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return new AppError(400, "File must be of type image.")
      };
    }

}


export default multarError;