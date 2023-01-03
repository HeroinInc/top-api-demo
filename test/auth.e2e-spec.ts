import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { testLoginDto } from './test.constants';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let server: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();

    await request(server)
      .post('/auth/register')
      .send(testLoginDto);

    const resp = await request(server)
      .post('/auth/login')
      .send(testLoginDto);

    const { access_token } = resp.body;
    token = access_token;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async (done) => {
    const { body, status } = await request(server)
      .post('/auth/login')
      .send(testLoginDto);

    const { access_token } = body;

    expect(status).toBe(200);
    expect(access_token).toBeDefined();
    done();
  });

  it('/auth/login (POST) - fail password', async (done) => {
    const { body, status } = await request(server)
      .post('/auth/login')
      .send({ ...testLoginDto, password: 'wrongPassword' });
    const { message } = body;

    expect(status).toBe(401);
    expect(message).toBe(WRONG_PASSWORD_ERROR);
    done();
  });

  it('/auth/login (POST) - fail login', async (done) => {
    const { body, status } = await request(server)
      .post('/auth/login')
      .send({ ...testLoginDto, login: 'wrongLogin@gmail.com' });
    const { message } = body;

    expect(status).toBe(401);
    expect(message).toBe(USER_NOT_FOUND_ERROR);
    done();
  });

  afterAll(async () => {
    await request(server)
      .delete('/auth/delete')
      .set('Authorization', `Bearer ${token}`)
      .send(testLoginDto);
    await disconnect();
  });
});
