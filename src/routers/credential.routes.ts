import { Router } from 'express';
import { validateSchemaMiddleware } from '@/middlewares/schema-validation';
import { authToken } from '@/middlewares/auth-middleware';
import { credentialsSchema, toDeleteById } from '@/schemas/credential.schema';
import { credentialController } from '@/controllers/credential.controller';

const credentialsRouter = Router()
  .all('/*', authToken)
  .post('/', validateSchemaMiddleware(credentialsSchema), credentialController.create)
  .get('/', credentialController.get)
  .delete('/', validateSchemaMiddleware(toDeleteById), credentialController.exclude);

export { credentialsRouter };
