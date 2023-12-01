import { ApiError } from '@/protocols';

export function invalidEmailError(email: string): ApiError {
  return {
    name: 'InvalidEmailError',
    message: `"${email}" is not valid or already in use`,
  };
}


export function invalidPasswordError(): ApiError {
  return {
    name: 'InvalidSignError',
    message: "password or email must be wrong",
  };
}