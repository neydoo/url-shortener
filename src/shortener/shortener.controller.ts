import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ShortenerService } from './shortener.service';
import { EncodeBody, StatusCode } from '../types';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}
  @Post('encode')
  async encode(
    @Res() res: Response,
    @Body() data: EncodeBody,
  ): Promise<Response> {
    try {
      const { url } = data;

      const responseData = await this.shortenerService.encodeURL(url);
      return res.status(StatusCode.Success).send({
        message: 'url successfully encoded',
        data: responseData,
      });
    } catch (error) {
      return res.status(StatusCode.Failure).json({
        message: error.message || 'an error occurred while encoding url',
      });
    }
  }

  @Get('decode/:code')
  async decode(
    @Res() res: Response,
    @Param('code') code: string,
  ): Promise<Response> {
    try {
      const responseData = await this.shortenerService.decodeURL(code);

      return res.status(StatusCode.Success).send({
        message: 'url has been successfully decoded',
        data: responseData,
      });
    } catch (error) {
      return res.status(StatusCode.Failure).send({
        message: error.message || 'an error occurred while retrieving url',
      });
    }
  }
}
