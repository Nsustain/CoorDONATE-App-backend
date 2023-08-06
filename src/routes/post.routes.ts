import express from "express";
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { postController } from "../controllers/postController";




const postRouter = express.Router();

postRouter.use(deserializeUser, requireUser);

postRouter.get("/feed", postController.getFeed);
postRouter.post("/new", postController.create);

export default postRouter;