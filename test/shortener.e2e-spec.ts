import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ShortenerModule } from '../src/shortener/shortener.module';
import { ShortenerService } from '../src/shortener/shortener.service';
import { StatusCode } from '../src/types';

describe('ShoretnerController (e2e)', () => {
  let app: INestApplication;
  const shortenerService = {
    encodeURL: () => ({
      code: 'test',
      longUrl: 'https://www.test.com',
    }),
    decodeURL: () => ({
      code: 'test',
      longUrl: 'https://www.test.com',
    }),
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ShortenerModule],
    })
      .overrideProvider(ShortenerService)
      .useValue(shortenerService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/encode (POST)', () => {
    return request(app.getHttpServer())
      .post('/shortener/encode')
      .send({ url: 'https://www.test.com' })
      .expect(StatusCode.Success, {
        message: 'url successfully encoded',
        data: {
          code: 'test',
          longUrl: 'https://www.test.com',
        },
      })
      .expect('Content-Type', /json/);
  });

  it('/decode (GET)', () => {
    return request(app.getHttpServer())
      .get('/shortener/decode/oo')
      .expect(StatusCode.Success, {
        message: 'url has been successfully decoded',
        data: {
          code: 'test',
          longUrl: 'https://www.test.com',
        },
      })
      .expect('Content-Type', /json/);
  });
});
