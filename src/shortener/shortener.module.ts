import { CacheModule, Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [ShortenerController],
  providers: [ShortenerService],
})
export class ShortenerModule {}
