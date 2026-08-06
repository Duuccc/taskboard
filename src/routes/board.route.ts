import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as boardController from '../controllers/board.controller.js';

const boardRouter = Router()

boardRouter.use(authenticate as any); // all board routes are protected

boardRouter.get("/", boardController.getBoards);
boardRouter.post('/', boardController.createBoard);

export default boardRouter;