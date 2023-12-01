import { userController } from "@/controllers/user.controller";
import { validateSchemaMiddleware } from "@/middlewares/schema-validation";
import { createUser } from "@/schemas/user.schema";
import { Router } from "express";


const usersRouter = Router();

usersRouter.post('/sign-up', validateSchemaMiddleware(createUser), userController.signUp);
usersRouter.post('/sign-in', validateSchemaMiddleware(createUser), userController.signIn);

export default usersRouter;