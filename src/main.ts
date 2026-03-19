import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any;
const expressApp = express();

export const bootstrap = async () => {
    if (!cachedApp) {
        console.log('[Main] Bootstrapping NestJS application...');
        try {
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
            console.log('[Main] Application initialized successfully');
        } catch (error) {
            console.error('[Main] Error during bootstrap:', error);
            throw error;
        }
    }
    return cachedApp;
};

// Handlers for Vercel
export default async (req: any, res: any) => {
    console.log(`[Vercel] Incoming request: ${req.method} ${req.url}`);
    try {
        await bootstrap();
        expressApp(req, res);
    } catch (error) {
        console.error('[Vercel] Handler error:', error);
        res.status(500).json({ error: 'Internal Server Error during startup', details: error.message });
    }
};

// Local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT ?? 3000;
    bootstrap().then(() => {
        expressApp.listen(port, () => {
            console.log(`Backend running on http://localhost:${port}/api`);
        });
    }).catch(err => {
        console.error('[Main] Local development startup failed:', err);
    });
}
