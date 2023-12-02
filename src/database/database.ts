import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export let prismadb: PrismaClient;

export function connectDb(): void {
  prismadb = new PrismaClient();
}

export default prisma;
