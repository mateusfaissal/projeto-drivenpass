import { invalidEmailError, invalidPasswordError } from '@/errors/sign-errors';
import { userRepository } from '@/repositories/user.repository';
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

async function signUp(email: string, password: string) {
    const verifyEmail = await userRepository.findByEmail(email);
    if (verifyEmail) throw invalidEmailError(email);

    const hash = await bcrypt.hash(password, 12);

    const user = await userRepository.createUser(email, hash);

    return user;
}

async function signIn(email: string, password: string) {
    
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw invalidEmailError(email);
        }
    
        
        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            throw invalidPasswordError();
        }
    
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        await userRepository.createSession(user.id, token);
    
        return { token: token };
    }





export const userService = {
    signUp, 
    signIn
};