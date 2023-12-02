import { ApiError } from '@/protocols';

export function sameCredentialError(): ApiError {
  return {
    name: 'sameCredentialError',
    message: 'You already have other credential with that same title',
  };
}
