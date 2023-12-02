import { ApiError } from '@/protocols';

export function unauthorizedError(): ApiError {
  return {
    name: 'unauthorizedError',
    message: 'Invalid token!',
  };
}
