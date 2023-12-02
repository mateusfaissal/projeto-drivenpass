import Cryptr from 'cryptr';
import { notFoundError } from '@/errors';
import { networkRepository } from '@/repositories';

async function create(userId: number, title: string, network: string, password: string) {
  const cryptr = new Cryptr(password);
  const hash = cryptr.encrypt(password);

  await networkRepository.create({ network, title, password: hash, userId });
}

async function get(userId: number) {
  const networks = await networkRepository.get(userId);

  return networks;
}

async function exclude(userId: number, id: number) {
  const existsNetwork = await networkRepository.checkById(userId, id);
  if (!existsNetwork) {
    throw notFoundError();
  }

  const deleteNetwork = await networkRepository.exclude(userId, id);
  if (!deleteNetwork) {
    throw notFoundError();
  }
}

export const networkService = {
  create,
  get,
  exclude,
};
