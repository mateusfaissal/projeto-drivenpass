import Joi from 'joi';
import { NetworkWithoutUserIdAndId, ToDelete } from '@/protocols';

export const networkSchema = Joi.object<NetworkWithoutUserIdAndId>({
  network: Joi.string().required(),
  title: Joi.string().required(),
  password: Joi.string().min(3).required(),
});

export const toDeleteByIdNetwork = Joi.object<ToDelete>({
  id: Joi.number().min(1).required(),
});
