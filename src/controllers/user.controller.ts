import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '@/protocols';
import { userService } from '@/services/user.service';

async function signIn(req: Request, res: Response) {
  const { email, password } = req.body as User;

  const result = await userService.signIn(email, password);

  return res.status(httpStatus.OK).send(result);
}

async function signUp(req: Request, res: Response) {
  const { email, password } = req.body as User;

  await userService.signUp(email, password);

  return res.sendStatus(httpStatus.CREATED);
}

export const userController = {
  signIn,
  signUp,
};
