import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import prisma from '@/database/database';

export async function createUser(params: Partial<User> = {}) {
  const newPassword = params.password || faker.internet.password();

  const hash = await bcrypt.hash(newPassword, 10);

  return prisma.user.create({
    data: {
      email: params.email || faker.internet.email(),
      password: hash,
    },
  });
}
