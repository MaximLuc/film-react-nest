export type DatabaseDriver = 'mongodb' | 'postgres';

const DEFAULT_PORT = 3000;
const DEFAULT_POSTGRES_PORT = 5432;

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readDatabaseDriver(value: string | undefined): DatabaseDriver {
  return value === 'postgres' ? 'postgres' : 'mongodb';
}

export interface AppConfig {
  port: number;
  database: {
    driver: DatabaseDriver;
    url: string;
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
}

export const configuration = (): AppConfig => ({
  port: readNumber(process.env.PORT, DEFAULT_PORT),
  database: {
    driver: readDatabaseDriver(process.env.DATABASE_DRIVER),
    url: process.env.DATABASE_URL ?? '',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: readNumber(process.env.DATABASE_PORT, DEFAULT_POSTGRES_PORT),
    name: process.env.DATABASE_NAME ?? '',
    username: process.env.DATABASE_USERNAME ?? '',
    password: process.env.DATABASE_PASSWORD ?? '',
  },
});

export const configProvider = {
  provide: 'CONFIG',
  useFactory: configuration,
};
