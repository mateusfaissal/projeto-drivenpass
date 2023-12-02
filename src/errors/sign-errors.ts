import { ApiError } from '@/protocols';

export function invalidEmailError(email: string): ApiError {
  return {
    name: 'invalidEmailError',
    message: `"${email}" is not valid or already in use`,
  };
}

export function invalidPasswordError(): ApiError {
  return {
    name: 'invalidSignError',
    message: 'password or email must be wrong',
  };
}
