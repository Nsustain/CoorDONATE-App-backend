import  express  from "express"
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { profileController } from "../controllers/profile.controller";

const profileRouter = express.Router();

profileRouter.use(deserializeUser, requireUser);

profileRouter.post('/', profileController.createProfile);
profileRouter.get('/:userId', profileController.getProfile);
profileRouter.put('/:userId', profileController.editProfile);
profileRouter.delete('/:userId', profileController.deleteProfile);

export default profileRouter;