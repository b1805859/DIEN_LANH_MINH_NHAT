import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

const INSECURE_SECRET_VALUES = new Set([
  '',
  'replace-me',
  'replace-with-a-secure-access-secret',
  'replace-with-a-secure-refresh-secret',
  'change-me-access-secret',
  'change-me-refresh-secret',
]);

function requireStrongProductionConfig(configService: ConfigService) {
  if (configService.get<string>('NODE_ENV') !== 'production') return;

  const accessSecret = configService.get<string>('JWT_ACCESS_SECRET', '');
  const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET', '');
  const corsOrigins = configService
    .get<string>('CORS_ORIGIN', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const hasWeakSecret =
    accessSecret.length < 32 ||
    refreshSecret.length < 32 ||
    accessSecret === refreshSecret ||
    INSECURE_SECRET_VALUES.has(accessSecret) ||
    INSECURE_SECRET_VALUES.has(refreshSecret);

  if (hasWeakSecret) {
    throw new Error(
      'Production requires distinct JWT_ACCESS_SECRET and JWT_REFRESH_SECRET values with at least 32 characters.',
    );
  }

  if (!corsOrigins.length || corsOrigins.includes('*')) {
    throw new Error('Production CORS_ORIGIN must list explicit trusted origins.');
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const configService = app.get(ConfigService);
  requireStrongProductionConfig(configService);
  const port = configService.get<number>('PORT', 4000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost');

  // The production stack has exactly one trusted reverse proxy (nginx). This
  // lets rate limiting use the real client IP instead of grouping all traffic.
  app.set('trust proxy', 1);
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));
  app.use(helmet());
  app.enableCors({
    origin: corsOrigin
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
