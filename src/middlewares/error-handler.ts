import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export type AppError = Error & {
  name: string;
};

export default function errorHandlingMiddleware(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const errorTypeToStatusCode = {
    notFoundError: httpStatus.NOT_FOUND,
    invalidIdError: httpStatus.UNPROCESSABLE_ENTITY,
    unauthorizedError: httpStatus.UNAUTHORIZED,
    invalidSignError: httpStatus.CONFLICT,
    invalidEmailError: httpStatus.CONFLICT,
    sameCredentialError: httpStatus.CONFLICT,
  };

  if (errorTypeToStatusCode[error.name]) {
    return res.status(errorTypeToStatusCode[error.name]).send(error.message);
  }

  console.error(error);
  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}
