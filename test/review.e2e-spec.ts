import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { testLoginDto, testReviewDto } from './test.constants';




describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
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

  it('/review/create (POST) - success', async (done) => {
    return request(server)
      .post('/review/create')
      .send(testReviewDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/review/create (POST) - fail', async (done) => {
    return request(server)
      .post('/review/create')
      .send({
        ...testReviewDto,
        rating: 0,
      })
      .expect(400)
      .then(({ body }) => {
        done();
      });
  });

  it('/review/byProduct/:productId (GET) - success', async (done) => {
    return request(server)
      .get('/review/byProduct/' + testReviewDto.productId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
        done();
      });
  });

  it('/review/byProduct/:productId (GET) - fail', async (done) => {
    return request(server)
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
        done();
      });
  });

  it('/review/:id (DELETE) - success', async (done) => {
    return request(server)
      .delete(`/review/` + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200).then(() => {
        done();
      });
  });

  it('/review/:id (DELETE) - fail', async (done) => {
    return request(server)
      .delete(`/review/` + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      }).then(() => {
        done();
      });
  });

  afterAll(async () => {
    await request(server)
      .delete('/auth/delete')
      .set('Authorization', `Bearer ${token}`)
      .send(testLoginDto);
    await disconnect();
  });
});
