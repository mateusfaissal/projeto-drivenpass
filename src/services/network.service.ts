import Cryptr from 'cryptr';
import { notFoundError } from '@/errors';
import { networkRepository } from '@/repositories';
import { NetworkWithoutId } from '@/protocols';

async function create(networkData: NetworkWithoutId) {
  const { password } = networkData;
  const cryptr = new Cryptr(password);
  const hash = cryptr.encrypt(password);

  await networkRepository.create({ ...networkData, password: hash });
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
