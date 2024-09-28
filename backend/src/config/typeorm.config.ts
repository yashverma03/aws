import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const typeormConfig = (configService: ConfigService): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    port: 5432,
    host: configService.getOrThrow('DB_HOST'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_DATABASE'),
    entities: [configService.getOrThrow('DB_ENTITIES')],
    migrations: [configService.getOrThrow('DB_MIGRATIONS')],
    migrationsTableName: 'typeorm_migrations',
    ssl: configService.getOrThrow('DB_SSL') === 'false' ? false : { rejectUnauthorized: false },
    logging: true
  };
};

export default typeormConfig;
