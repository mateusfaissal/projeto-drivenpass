import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthRequest } from '@/middlewares/auth-middleware';
import { NetworkWithoutId, ToDelete } from '@/protocols';
import { networkService } from '@/services';

async function create(req: AuthRequest, res: Response) {
  const networkData: NetworkWithoutId = {
    title: req.body.title,
    network: req.body.network,
    password: req.body.password,
    userId: Number(req.userId),
  };

  await networkService.create(networkData);
  return res.sendStatus(httpStatus.CREATED);
}

async function get(req: AuthRequest, res: Response) {
  const userId = Number(req.userId);

  const networks = await networkService.get(userId);
  return res.status(httpStatus.OK).send(networks);
}

async function exclude(req: AuthRequest, res: Response) {
  const { id } = req.body as ToDelete;
  const userId = Number(req.userId);

  await networkService.exclude(userId, id);
  return res.sendStatus(httpStatus.OK);
}

export const networkController = {
  create,
  get,
  exclude,
};
