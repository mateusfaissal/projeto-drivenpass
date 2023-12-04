import { faker } from '@faker-js/faker';
import prisma from '@/database/database';
import { NetworkWithoutId } from '@/protocols';

export async function createNetwork(userId: number) {
  return prisma.network.create({
    data: {
      network: faker.lorem.word(),
      title: faker.lorem.word(),
      password: faker.internet.password(7),
      userId,
    },
  });
}

export async function createNetworkByData(data: NetworkWithoutId) {
  return prisma.network.create({
    data,
  });
}
