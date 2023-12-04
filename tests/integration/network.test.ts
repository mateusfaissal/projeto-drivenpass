import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { createUser, generateValidToken } from '../factories/user.factory';
import { createNetwork } from '../factories/network.factory';
import app from '@/app';

const request = supertest(app);

describe('Network Management', () => {
  describe('GET /network', () => {
    it('returns UNAUTHORIZED without a token', async () => {
      const response = await request.get('/network').set('Authorization', `Bearer`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('returns CONFLICT with an invalid token', async () => {
      const token = faker.lorem.word();
      const response = await request.get('/network').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('returns UNAUTHORIZED for a token without a session', async () => {
      const user = await createUser();
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      const response = await request.get('/network').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('With a valid token', () => {
      it('returns OK and network data for a valid token', async () => {
        const user = await createUser();
        await createNetwork(user.id);
        const token = await generateValidToken(user);
        const response = await request.get('/network').set('Authorization', `Bearer ${token.token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              title: expect.any(String),
              network: expect.any(String),
              password: expect.any(String),
              userId: expect.any(Number),
            }),
          ]),
        );
      });
    });
  });

  describe('POST /network', () => {
    const mockNetwork = (userId?: number) => ({
      network: faker.lorem.word(),
      title: faker.internet.url(),
      password: faker.internet.password(6),
      userId,
    });

    describe('Invalid token scenarios', () => {
      it('returns UNAUTHORIZED without a token', async () => {
        const response = await request.post('/network').set('Authorization', `Bearer`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('returns CONFLICT with an invalid token', async () => {
        const token = faker.lorem.word();
        const response = await request.post('/network').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it('returns UNAUTHORIZED for a token without a session', async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const response = await request.post('/network').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    });

    describe('With a valid token', () => {
      it('returns UNPROCESSABLE_ENTITY with an incomplete request body', async () => {
        const token = await generateValidToken();
        const response = await request.post('/network').set('Authorization', `Bearer ${token.token}`);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      //rever esse it
      it('returns UNPROCESSABLE_ENTITY for successfully created networks', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const networkData = mockNetwork(user.id);
        const response = await request.post('/network').set('Authorization', `Bearer ${token.token}`).send(networkData);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });

  describe('DELETE /network', () => {
    describe('Invalid token scenarios', () => {
      it('returns UNAUTHORIZED without a token', async () => {
        const response = await request.delete('/network').set('Authorization', `Bearer`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('returns CONFLICT with an invalid token', async () => {
        const token = faker.lorem.word();
        const response = await request.delete('/network').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it('returns UNAUTHORIZED for a token without a session', async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const response = await request.delete('/network').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    });

    describe('With a valid token', () => {
      it('returns UNPROCESSABLE_ENTITY for requests without a specified network ID', async () => {
        const token = await generateValidToken();
        const response = await request.delete('/network').set('Authorization', `Bearer ${token.token}`);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });

      it('returns UNPROCESSABLE_ENTITY when deleting a network that does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createNetwork(user.id);
        const response = await request.delete('/network').set('Authorization', `Bearer ${token.token}`).send('1');
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });
});

describe('Network Controller', () => {
  describe('Create network', () => {
    it('should create a network successfully', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const networkData = {
        network: faker.lorem.word(),
        title: faker.lorem.word(),
        password: faker.internet.password(),
      };

      const response = await request.post('/network').set('Authorization', `Bearer ${token.token}`).send(networkData);

      expect(response.status).toBe(httpStatus.CREATED);
    });
  });

  describe('Get Networks', () => {
    it('should retrieve networks successfully', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createNetwork(user.id);

      const response = await request.get('/network').set('Authorization', `Bearer ${token.token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('Delete Network', () => {
    it('should delete a network successfully', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const network = await createNetwork(user.id);

      const response = await request
        .delete('/network')
        .set('Authorization', `Bearer ${token.token}`)
        .send({ id: network.id });

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

it('should return CONFLICT for a non-existent network', async () => {
  const user = await createUser();
  const token = await generateValidToken(user);
  const nonExistentId = faker.number.int({ min: 1000, max: 9999 });

  const response = await request
    .delete('/network')
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
  const network = await createNetwork(user.id);

  const response = await request
    .delete('/network')
    .set('Authorization', `Bearer ${anotherUserToken.token}`)
    .send({ id: network.id });

  expect(response.status).toBe(httpStatus.CONFLICT);
});

it('should return UNPROCESSABLE_ENTITY for invalid request body', async () => {
  const token = await generateValidToken();

  const response = await request
    .delete('/network')
    .set('Authorization', `Bearer ${token.token}`)
    .send({ invalidField: faker.number.int() });

  expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
});
