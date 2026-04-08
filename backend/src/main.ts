import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { TskvLogger } from './logger/tskv.logger';
import { JsonLogger } from './logger/json.logger';
import { DevLogger } from './logger/dev.logger';
import { AppConfig, LoggerType } from './app.config.provider';
import { LoggerService } from '@nestjs/common';

function createLogger(type: LoggerType): LoggerService {
  switch (type) {
    case 'dev':
      return new DevLogger();
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get<AppConfig>('CONFIG');
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(createLogger(config.logger.type));
  await app.listen(config.port);
}
bootstrap();
