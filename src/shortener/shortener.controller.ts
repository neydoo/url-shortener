import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShortenerService } from './shortener.service';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}
  @Post('encode')
  async encode(@Body() data: { url: string }) {
    const { url } = data;

    return await this.shortenerService.encodeFromURL(url);
  }

  @Get('decode/:code')
  async decode(@Param('code') code: string) {
    return await this.shortenerService.getURLFromCode(code);
  }
}
