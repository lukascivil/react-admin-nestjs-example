import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should GET: / list of available resources )', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body instanceof Array).toBeTruthy();
      });
  });

  it('should GET: /task return list of objects with ids', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body instanceof Array).toBeTruthy();
      });
  });

  it('should GET: /task/:id return a specific task selected by id', () => {
    const selectedId = 4;

    return request(app.getHttpServer())
      .get(`/tasks/${selectedId}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.id).toEqual(selectedId);
      });
  });
});
