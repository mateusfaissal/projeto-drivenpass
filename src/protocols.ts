import { Credential, Network } from '@prisma/client';

export type User = {
  email: string;
  password: string;
};

export type ApiError = {
  name: string;
  message: string;
};

export type CredentialWithoutId = Omit<Credential, 'id'>;

export type ToDelete = {
  id: number;
};

export type CredentialWithoutUserIdAndId = Omit<Credential, 'id' | 'userId'>;

export type NetworkWithoutUserIdAndId = Omit<Network, 'id' | 'userId'>;

export type NetworkWithoutId = Omit<Network, 'id'>;
