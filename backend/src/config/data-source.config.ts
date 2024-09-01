import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

const configService = new ConfigService();

const options: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: configService.getOrThrow('DB_HOST'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_DATABASE'),
  entities: [configService.getOrThrow('DB_ENTITIES')],
  migrations: [configService.getOrThrow('DB_MIGRATIONS')],
  migrationsTableName: 'typeorm_migrations'
};

export default new DataSource(options);
