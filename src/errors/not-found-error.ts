import { ApiError } from '@/protocols';

export function notFoundError(): ApiError {
  return {
    name: 'notFoundError',
    message: 'We cannot found anything for this search',
  };
}
