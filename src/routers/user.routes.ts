import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation';
import { createUser } from '@/schemas/user.schema';

const signUpRouter = Router().post('/', validateSchemaMiddleware(createUser), userController.signUp);

const signInRouter = Router().post('/', validateSchemaMiddleware(createUser), userController.signIn);

export { signUpRouter, signInRouter };
