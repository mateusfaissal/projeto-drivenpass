import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation';
import { createUser } from '@/schemas/user.schema';

const usersRouter = Router()
  .post('/', validateSchemaMiddleware(createUser), userController.signUp)
  .post('/', validateSchemaMiddleware(createUser), userController.signIn);

export { usersRouter };
