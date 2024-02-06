import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from '@/middlewares/auth-middleware';
import { ToDelete, CredentialWithoutId } from '@/protocols';
import { credentialService } from '@/services/credential.service';

async function create(req: AuthRequest, res: Response) {
  const credentialData: CredentialWithoutId = {
    title: req.body.title,
    url: req.body.url,
    username: req.body.username,
    password: req.body.password,
    userId: Number(req.userId),
  };

  await credentialService.post(credentialData);
  return res.sendStatus(httpStatus.CREATED);
}

async function get(req: AuthRequest, res: Response) {
  const userId = Number(req.userId);

  const credentials = await credentialService.get(userId);
  return res.status(httpStatus.OK).send(credentials);
}

async function exclude(req: AuthRequest, res: Response) {
  const { id } = req.body as ToDelete;
  const userId = Number(req.userId);

  await credentialService.exclude(userId, id);
  return res.sendStatus(httpStatus.OK);
}

export const credentialController = {
  create,
  get,
  exclude,
};
