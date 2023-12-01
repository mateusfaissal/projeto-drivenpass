import prisma from "@/database/database";

async function findByEmail(email: string) {
    return prisma.user.findFirst({
        where: {
            email
        }
    })
}

async function createUser(email: string, password: string) {
    return prisma.user.create({
        data: {
            email,
            password
        }
    })
}

async function createSession(userId: number, token: string) {

    return prisma.session.create({
        data: {
            userId,
            token
        }
    })
}

export const userRepository = {
    findByEmail,
    createUser,
    createSession
}