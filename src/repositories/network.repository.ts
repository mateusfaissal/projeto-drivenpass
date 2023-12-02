import prisma from '@/database/database';
import { NetworkWithoutId } from '@/protocols';

async function create(data: NetworkWithoutId) {
  return prisma.network.create({
    data,
  });
}

async function get(userId: number) {
  return prisma.network.findMany({
    where: {
      userId,
    },
  });
}

async function exclude(userId: number, id: number) {
  return prisma.network.delete({
    where: {
      userId,
      id,
    },
  });
}

async function checkById(userId: number, id: number) {
  return prisma.network.findMany({
    where: {
      userId,
      id,
    },
  });
}

export const networkRepository = {
  create,
  get,
  exclude,
  checkById,
};
