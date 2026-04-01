import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppConfig,
  DatabaseDriver,
  configuration,
} from '../app.config.provider';
import { Film, FilmSchema } from '../films/films.schema';
import { MongooseFilmsRepository } from '../repository/mongoose-films.repository';
import { FilmsRepository } from '../repository/films.repository';
import { TypeormFilmsRepository } from '../repository/typeorm-films.repository';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

function resolveDatabaseDriver(): DatabaseDriver {
  return configuration().database.driver;
}

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const driver = resolveDatabaseDriver();
    const repositoryImplementation =
      driver === 'mongodb' ? MongooseFilmsRepository : TypeormFilmsRepository;
    const imports =
      driver === 'mongodb'
        ? [
            MongooseModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (config: ConfigService<AppConfig>) => {
                const uri = config.get<string>('database.url', { infer: true });

                if (!uri) {
                  throw new Error('DATABASE_URL is not set for MongoDB mode');
                }

                return { uri };
              },
            }),
            MongooseModule.forFeature([
              { name: Film.name, schema: FilmSchema },
            ]),
          ]
        : [
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (config: ConfigService<AppConfig>) => ({
                type: 'postgres',
                host: config.get<string>('database.host', { infer: true }),
                port: config.get<number>('database.port', { infer: true }),
                database: config.get<string>('database.name', { infer: true }),
                username: config.get<string>('database.username', {
                  infer: true,
                }),
                password: config.get<string>('database.password', {
                  infer: true,
                }),
                entities: [FilmEntity, ScheduleEntity],
                synchronize: false,
              }),
            }),
            TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
          ];

    return {
      module: DatabaseModule,
      imports: [ConfigModule, ...imports],
      providers: [
        repositoryImplementation,
        {
          provide: FilmsRepository,
          useExisting: repositoryImplementation,
        },
      ],
      exports: [FilmsRepository],
    };
  }
}
