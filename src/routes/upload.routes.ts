import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { uploadController } from '../controllers/upload.controller';
import upload from '../middleware/multarMiddleware';



const uploadRouter = express.Router();

uploadRouter.use(deserializeUser, requireUser);


uploadRouter.post('/', upload.array("files") , uploadController.upload)

export default uploadRouter;