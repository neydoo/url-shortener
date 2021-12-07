/* eslint-disable @typescript-eslint/no-empty-function */
import { CacheModule, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { createMock } from '@golevelup/ts-jest';

const mockResponseObject = () => {
  return createMock<Response>({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  });
};
describe('ShortenerController Unit Tests', () => {
  let spyService: ShortenerService;
  let controller: ShortenerController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      imports: [CacheModule.register()],
      providers: [ShortenerService],
    }).compile();

    controller = module.get<ShortenerController>(ShortenerController);
    spyService = module.get<ShortenerService>(ShortenerService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the encoded url', async () => {
    const url = 'https://www.test.com';

    const encodeSpy = jest.spyOn(spyService, 'encodeURL');
    const res = mockResponseObject();
    await controller.encode(res, { url });
    expect(encodeSpy).toBeCalled();
  });

  it('should return the decoded url', async () => {
    const decodeSpy = jest.spyOn(spyService, 'decodeURL');
    const res = mockResponseObject();
    await controller.decode(res, 'test');
    expect(decodeSpy).toBeCalled();
  });
});
