import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any;
const expressApp = express();

export const bootstrap = async () => {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
};

// Handlers for Vercel
export default async (req: any, res: any) => {
  await bootstrap();
  expressApp(req, res);
};

// Local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT ?? 3000;
  bootstrap().then(() => {
    expressApp.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}/api`);
    });
  });
}
