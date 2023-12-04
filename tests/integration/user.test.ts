import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { createUser } from '../factories/user.factory';
import app from '@/app';

const request = supertest(app);

describe('User Signup Endpoint', () => {
  it('returns UNPROCESSABLE_ENTITY for empty request body', async () => {
    const response = await request.post('/sign-up');

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('returns UNPROCESSABLE_ENTITY for non-conforming request body', async () => {
    const randomBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await request.post('/sign-up').send(randomBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe('Valid Request Body', () => {
    const generateValidUser = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it('returns CONFLICT for an already registered email', async () => {
      const user = generateValidUser();
      await createUser(user);

      const response = await request.post('/sign-up').send(user);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('creates a new user successfully with status CREATED', async () => {
      const newUser = generateValidUser();

      const response = await request.post('/sign-up').send(newUser);
      expect(response.status).toBe(httpStatus.CREATED);
    });
  });
});

describe('User Sign-In Endpoint', () => {
  it('returns UNPROCESSABLE_ENTITY for requests without a body', async () => {
    const response = await request.post('/sign-in');

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('returns UNPROCESSABLE_ENTITY for requests with an invalid body', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await request.post('/sign-in').send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe('With Valid Credentials', () => {
    const generateValidCredentials = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it('returns CONFLICT for non-existent emails', async () => {
      const credentials = generateValidCredentials();

      const response = await request.post('/sign-in').send(credentials);
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('returns CONFLICT for incorrect emails', async () => {
      const credentials = generateValidCredentials();
      await createUser(credentials);

      const response = await request.post('/sign-in').send({ ...credentials, email: faker.internet.email() });
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('returns CONFLICT for incorrect passwords', async () => {
      const credentials = generateValidCredentials();
      await createUser(credentials);

      const response = await request.post('/sign-in').send({ ...credentials, password: faker.internet.password(10) });
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    describe('Successful Authentication', () => {
      it('returns OK with a token for successful sign-ins', async () => {
        const credentials = generateValidCredentials();
        await createUser(credentials);

        const response = await request.post('/sign-in').send(credentials);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.token).toBeDefined();
      });
    });
  });
});
