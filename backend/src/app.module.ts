import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider, configuration } from './app.config.provider';
import { DatabaseModule } from './database/database.module';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: path.join(__dirname, '..', '.env'),
      load: [configuration],
    }),
    DatabaseModule.register(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      exclude: ['/api/afisha/*'],
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsService, OrderService],
})
export class AppModule {}
