import Joi from 'joi';
import { CredentialWithoutId, ToDelete } from '@/protocols';

export const toDeleteById = Joi.object<ToDelete>({
  id: Joi.number().min(1).required(),
});

export const credentialsSchema = Joi.object<CredentialWithoutId>({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
});
