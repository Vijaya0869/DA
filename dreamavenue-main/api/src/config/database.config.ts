import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomNamingStrategy } from './custom-naming-strategy';
import * as process from 'node:process';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: 'public',
  entities: process.env.IS_BUILD
    ? ['src/**/*.entity{.ts,.js}']
    : ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: true,
  namingStrategy: new CustomNamingStrategy(),
});
