import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { searchController } from '../controllers/search.controller';

const searchRouter = express.Router();

searchRouter.use(deserializeUser, requireUser);

searchRouter.get('/', searchController.search);

export default searchRouter;
