import express, { json, Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { networkRouter, credentialsRouter, signUpRouter, signInRouter } from './routers';
import errorHandlingMiddleware from './middlewares/error-handler';
import { connectDb } from './database/database';

const app = express();

app
  .use(cors())
  .use(json())
  .use('/sign-up', signUpRouter)
  .use('/sign-in', signInRouter)
  .use('/credentials', credentialsRouter)
  .use('/networks', networkRouter)
  .use(errorHandlingMiddleware);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export default app;
