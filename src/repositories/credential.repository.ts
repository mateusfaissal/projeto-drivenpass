import prisma from '@/database/database';
import { CredentialWithoutId } from '@/protocols';

async function checkCredential(userId: number, title: string, username: string) {
  return prisma.credential.findFirst({
    where: {
      userId,
      title,
      username,
    },
  });
}

async function create(data: CredentialWithoutId) {
  return prisma.credential.create({
    data,
  });
}

async function getCredentialByUserId(userId: number) {
  return prisma.credential.findMany({
    where: {
      userId,
    },
  });
}

async function deleteById(id: number, userId: number) {
  return prisma.credential.delete({
    where: {
      userId,
      id,
    },
  });
}

async function getId(userId: number, id: number) {
  return prisma.credential.findMany({
    where: {
      userId,
      id,
    },
  });
}

export const credentialRepository = {
  checkCredential,
  create,
  getCredentialByUserId,
  deleteById,
  getId,
};
