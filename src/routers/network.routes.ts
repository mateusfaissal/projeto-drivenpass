import { Router } from 'express';
import { authToken } from '@/middlewares/auth-middleware';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation';
import { networkSchema, toDeleteByIdNetwork } from '@/schemas/network.schema';
import { networkController } from '@/controllers';

const networkRouter = Router()
  .all('/*', authToken)
  .post('/', validateSchemaMiddleware(networkSchema), networkController.create)
  .get('/', networkController.get)
  .delete('/', validateSchemaMiddleware(toDeleteByIdNetwork), networkController.exclude);

export { networkRouter };
