import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server: any = (express as any).default ? (express as any).default() : (express as any)();

export const bootstrap = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app;
};

// Start local server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  bootstrap(server).then(async (app) => {
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    Logger.log(`Backend running on http://localhost:${port}/api`);
  });
}

export default server;
