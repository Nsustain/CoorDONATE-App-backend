import  express  from "express"
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { profileController } from "../controllers/profile.controller";

const profileRouter = express.Router();

profileRouter.use(deserializeUser, requireUser);

profileRouter.post('/', profileController.createProfile);


export default profileRouter;