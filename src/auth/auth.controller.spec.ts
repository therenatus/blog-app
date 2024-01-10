import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import * as mongoose from 'mongoose';
import { appSettings } from '../app.settings';
import request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';

const data = {
  login: 'admin3',
  password: 'qwerty123',
  email: 'admin@company.co',
};

const login = {
  loginOrEmail: 'admin3',
  password: 'qwerty123',
};
const loginIncorrect = {
  loginOrEmail: 'admins',
  password: 'qwerty123',
};

describe('AuthController', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            return { uri: mongoUri };
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    appSettings(app);

    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });

  describe('create user', () => {
    it('should return 204', async () => {
      const response = await request(httpServer)
        .post('/api/auth/registration')
        .send(data);

      console.log(response.body);

      expect(response.statusCode).toEqual(204);
    });
    it('should return 400', async () => {
      const response = await request(httpServer)
        .post('/api/auth/registration')
        .send();

      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/login', () => {
    it('should return 200 and accessToken', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send(login);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('accessToken');
    });
    it('should return 401', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send(loginIncorrect);

      expect(response.statusCode).toEqual(401);
    });
    it('should return 400', async () => {
      const response = await request(httpServer).post('/api/auth/login').send();

      expect(response.statusCode).toEqual(401);
    });
  });
});
