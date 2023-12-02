import Cryptr from 'cryptr';
import { notFoundError, sameCredentialError } from '@/errors';
import { credentialRepository } from '@/repositories/credential.repository';

async function post(userId: number, title: string, url: string, username: string, password: string) {
  const checkCredential = await credentialRepository.checkCredential(userId, title, username);
  if (checkCredential) {
    throw sameCredentialError();
  }

  this.cryptr = new Cryptr(password);
  const hash = this.cryptr.encrypt(password);

  await credentialRepository.create({ title, url, username, password: hash, userId });
}

async function get(userId: number) {
  const credential = await credentialRepository.getCredentialByUserId(userId);
  if (!credential) {
    throw notFoundError();
  }

  return credential;
}

async function exclude(userId: number, id: number) {
  const existsCredential = await credentialRepository.getId(userId, id);
  if (!existsCredential) {
    throw notFoundError();
  }

  const deleteCredential = await credentialRepository.deleteById(id, userId);
  if (!deleteCredential) {
    throw notFoundError();
  }
}

export const credentialService = {
  post,
  get,
  exclude,
};
