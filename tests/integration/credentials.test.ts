import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { createUser, generateValidToken } from '../factories/user.factory';
import { createCredential, createCredentialByData } from '../factories/credentials.factory';
import app from '@/app';

const request = supertest(app);

describe('Credential Management', () => {
  describe('GET /credential', () => {
    it('returns UNAUTHORIZED without a token', async () => {
      const response = await request.get('/credential').set('Authorization', `Bearer`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('returns CONFLICT with an invalid token', async () => {
      const token = faker.lorem.word();
      const response = await request.get('/credential').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('returns UNAUTHORIZED for a token without a session', async () => {
      const user = await createUser();
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      const response = await request.get('/credential').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('With a valid token', () => {
      it('returns OK and credential data for a valid token', async () => {
        const user = await createUser();
        await createCredential(user.id);
        const token = await generateValidToken(user);
        const response = await request.get('/credential').set('Authorization', `Bearer ${token.token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              title: expect.any(String),
              url: expect.any(String),
              username: expect.any(String),
              password: expect.any(String),
              userId: expect.any(Number),
            }),
          ]),
        );
      });
    });
  });

  describe('POST /credential', () => {
    const mockCredential = (userId?: number) => ({
      title: faker.lorem.word(),
      url: faker.internet.url(),
      username: faker.internet.userName(),
      password: faker.internet.password(6),
      userId,
    });

    describe('Invalid token scenarios', () => {
      it('returns UNAUTHORIZED without a token', async () => {
        const response = await request.post('/credential').set('Authorization', `Bearer`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('returns CONFLICT with an invalid token', async () => {
        const token = faker.lorem.word();
        const response = await request.post('/credential').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it('returns UNAUTHORIZED for a token without a session', async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const response = await request.post('/credential').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    });

    describe('With a valid token', () => {
      it('returns UNPROCESSABLE_ENTITY with an incomplete request body', async () => {
        const token = await generateValidToken();
        const response = await request.post('/credential').set('Authorization', `Bearer ${token.token}`);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      it('returns UNPROCESSABLE_ENTITY when creating a credential with a duplicate title', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const credentialData = mockCredential(user.id);
        await createCredentialByData(credentialData);
        const response = await request
          .post('/credential')
          .set('Authorization', `Bearer ${token.token}`)
          .send(credentialData);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      it('returns UNPROCESSABLE_ENTITY for successfully created credentials', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const credentialData = mockCredential(user.id);
        const response = await request
          .post('/credential')
          .set('Authorization', `Bearer ${token.token}`)
          .send(credentialData);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });

  describe('DELETE /credential', () => {
    describe('Invalid token scenarios', () => {
      it('returns UNAUTHORIZED without a token', async () => {
        const response = await request.delete('/credential').set('Authorization', `Bearer`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('returns CONFLICT with an invalid token', async () => {
        const token = faker.lorem.word();
        const response = await request.delete('/credential').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it('returns UNAUTHORIZED for a token without a session', async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const response = await request.delete('/credential').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    });

    describe('With a valid token', () => {
      it('returns UNPROCESSABLE_ENTITY for requests without a specified credential ID', async () => {
        const token = await generateValidToken();
        const response = await request.delete('/credential').set('Authorization', `Bearer ${token.token}`);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      it('returns UNPROCESSABLE_ENTITY when deleting a credential that does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createCredential(user.id);
        const response = await request.delete('/credential').set('Authorization', `Bearer ${token.token}`).send('1');
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });
});

describe('Credential Controller', () => {
  describe('Create Credential', () => {
    it('should create a credential successfully', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const credentialData = {
        title: faker.lorem.word(),
        url: faker.internet.url(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const response = await request
        .post('/credential')
        .set('Authorization', `Bearer ${token.token}`)
        .send(credentialData);

      expect(response.status).toBe(httpStatus.CREATED);
    });
  });

  describe('Get Credentials', () => {
    it('should retrieve credentials successfully', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createCredential(user.id);

      const response = await request.get('/credential').set('Authorization', `Bearer ${token.token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('Delete Credential', () => {
    it('should delete a credential successfully', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const credential = await createCredential(user.id);

      const response = await request
        .delete('/credential')
        .set('Authorization', `Bearer ${token.token}`)
        .send({ id: credential.id });

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

it('should return CONFLICT for a non-existent credential', async () => {
  const user = await createUser();
  const token = await generateValidToken(user);
  const nonExistentId = faker.number.int({ min: 1000, max: 9999 });

  const response = await request
    .delete('/credential')
    .set('Authorization', `Bearer ${token.token}`)
    .send({ id: nonExistentId });

  expect(response.status).toBe(httpStatus.CONFLICT);
});

it('should return UNAUTHORIZED for an unauthorized user', async () => {
  const user = await createUser();
  const anotherUserToken = await generateValidToken({
    id: faker.number.int({ min: 1000, max: 9999 }),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });
  const credential = await createCredential(user.id);

  const response = await request
    .delete('/credential')
    .set('Authorization', `Bearer ${anotherUserToken.token}`)
    .send({ id: credential.id });

  expect(response.status).toBe(httpStatus.CONFLICT);
});

it('should return UNPROCESSABLE_ENTITY for invalid request body', async () => {
  const token = await generateValidToken();

  const response = await request
    .delete('/credential')
    .set('Authorization', `Bearer ${token.token}`)
    .send({ invalidField: faker.number.int() });

  expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
});
