import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as tasksController from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../validation/task.schema.js';

const tasksRouter = Router();
tasksRouter.use(authenticate as any); // all task routes are protected

tasksRouter.get('/',     tasksController.getTasks );
tasksRouter.post('/',   validate(createTaskSchema), tasksController.createTask );
tasksRouter.patch('/:id', validate(updateTaskSchema), tasksController.updateTask );
tasksRouter.delete('/:id', tasksController.deleteTask);

export default tasksRouter;