import express, { json, Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { usersRouter, networkRouter, credentialsRouter } from './routers';
import errorHandlingMiddleware from './middlewares/error-handler';
import { connectDb } from './database/database';

const app = express();

app
  .use(cors())
  .use(json())
  .use('/sign-up', usersRouter)
  .use('/sign-in', usersRouter)
  .use('/credentials', credentialsRouter)
  .use('/networks', networkRouter)
  .use(errorHandlingMiddleware);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export default app;
