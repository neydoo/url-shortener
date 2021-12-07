import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as Crypto from 'crypto';
import { Cache } from 'cache-manager';
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
}
