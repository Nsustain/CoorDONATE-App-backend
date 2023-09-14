import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

const fileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    cb: multer.FileFilterCallback
    ) => {
        
    if (file.mimetype.split("/")[0] === "image" || file.mimetype.toLowerCase().startsWith("image/")) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10000000, files: 10 },
  });


export default upload;


