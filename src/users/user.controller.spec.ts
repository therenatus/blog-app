import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { appSettings } from '../app.settings';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

describe('UserController', () => {
  let app: INestApplication;
  let httpServer;
  let mongoServer: MongoMemoryServer;
  //class EmailMailAdapter implements
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    app = moduleFixture.createNestApplication();

    appSettings(app);

    await app.init();
    await mongoose.connect(mongoUri);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });

  describe('create user', () => {
    it('User should be created', () => {
      request(httpServer).post('/users').send();
    });
  });
});
