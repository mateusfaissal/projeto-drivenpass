import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { unauthorizedError } from '@/errors/unauthorized-error';
import { userRepository } from '@/repositories';

export async function authToken(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  if (!header) {
    throw unauthorizedError();
  }

  const token = header.split('')[1];
  if (!token) {
    throw unauthorizedError();
  }

  const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  const userSession = await userRepository.findByToken(token);
  if (!userSession) {
    throw unauthorizedError();
  }
  req.userId = userId;
  next();
}

export type AuthRequest = Request & JwtPayload;

type JwtPayload = {
  userId: number;
};
