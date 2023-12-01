import express, { json } from 'express';
import 'express-async-errors';
import usersRouter from './routers/user.routes';
import errorHandlingMiddleware from './middlewares/error-handler';
import cors from 'cors'


const app = express()


app
    .use(cors())
    .use(json())
    .use('/sign-up', usersRouter)
    .use('/sign-in', usersRouter)
    .use(errorHandlingMiddleware)

export default app