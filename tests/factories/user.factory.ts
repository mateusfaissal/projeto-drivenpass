import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
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

export async function createSession(token: string) {
  const user = await createUser();

  return prisma.session.create({
    data: {
      token,
      userId: user.id,
    },
  });
}

export async function generateValidToken(user?: User) {
  const newUser = user || (await createUser());

  const token = jwt.sign(
    {
      userId: newUser.id,
    },
    process.env.JWT_SECRET,
  );

  await createSession(token);

  return {
    token,
    userid: newUser.id,
  };
}
