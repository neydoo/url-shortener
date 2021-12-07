import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as Crypto from 'crypto';
import { Cache } from 'cache-manager';
import { UrlData } from 'src/types';
@Injectable()
export class ShortenerService {
  private readonly cryptoJs: any;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.cryptoJs = Crypto;
  }
  async generateCode(): Promise<string> {
    const code = this.cryptoJs
      .randomBytes(Math.ceil((5 * 3) / 4))
      .toString('base64')
      .replace(/\+/g, '0')
      .replace(/\//g, '0')
      .slice(0, 5);
    return code;
  }

  async encodeFromURL(longUrl: string): Promise<string> {
    // to make sure that the code returned is unique,
    // 1. generate code
    // 2. query the cache with the code,
    // if data exists, repeat 1 & 2, until a unique code is generated.
    // 3. save code to cache
    let isUnique = false;
    let code: string;
    while (!isUnique) {
      code = await this.generateCode();
      const existingCode = await this.getURLFromCode(code);
      if (!existingCode) {
        isUnique = true;
        await this.cacheManager.set(code, longUrl, {
          ttl: 10000, // default time is 5 secs
        });
        return code;
      }
    }
  }

  async getURLFromCode(code: string): Promise<string> {
    return this.cacheManager.get(code);
  }

  async encodeURL(url: string): Promise<UrlData> {
    if (!url) {
      throw new Error('invalid url provided');
    }

    const code = await this.encodeFromURL(url);
    const responseData: UrlData = { code, longUrl: url };

    return responseData;
  }

  async decodeURL(code: string): Promise<UrlData> {
    const longUrl = await this.getURLFromCode(code);

    if (!longUrl) {
      throw new Error('invalid code provided');
    }

    return { code, longUrl };
  }
}
