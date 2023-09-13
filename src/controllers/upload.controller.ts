import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../services/cloudinary.service";

class UploadController {

    public upload = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const results = await uploadToCloudinary(req.files as Express.Multer.File[]);
            
            let imageUrls = []
            for (let result of results){
                imageUrls.push(result.secure_url);
            }

            return res.status(200).json({ message: 'Files uploaded to Cloudinary', imageUrls });

        } catch(err) {

            next(err)
        }
    }
}

export const uploadController = new UploadController();