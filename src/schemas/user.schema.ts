import Joi from 'joi';
import { User } from '@/protocols';

export const createUser = Joi.object<User>({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});
