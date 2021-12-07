import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerService } from './shortener.service';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [ShortenerService],
    }).compile();

    service = module.get<ShortenerService>(ShortenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should enocde the url and return the encoded value', async () => {
    const generateCode = jest.spyOn(service, 'generateCode');
    const encodeFromURL = jest.spyOn(service, 'encodeFromURL');
    await service.encodeFromURL('https://www.test.com');
    expect(generateCode).toHaveBeenCalled();
    expect(encodeFromURL).toHaveReturned();
  });

  it('should throw an error if code is invalid', async () => {
    try {
      const getURLFromCode = jest.spyOn(service, 'getURLFromCode');
      const decodeURL = jest.spyOn(service, 'decodeURL');
      await service.decodeURL('ght');
      expect(getURLFromCode).toHaveBeenCalled();
      expect(decodeURL).not.toHaveReturned();
    } catch (e) {
      expect(e.message).toMatch('invalid code provided');
    }
  });

  it('should decode the short url, and return the long url', async () => {
    const getURL = jest.spyOn(service, 'getURLFromCode');
    const url = 'http://www.test.com';
    const code = await service.encodeFromURL(url);
    const decodedUrl = await service.decodeURL(code);
    expect(decodedUrl.longUrl).toMatch(url);
    expect(getURL).toHaveBeenCalledWith(code);
  });

  afterAll(async () => {
    await module.close();
  });
});
