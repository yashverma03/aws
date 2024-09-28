import { MigrationInterface, QueryRunner } from 'typeorm';
import { dropTable } from '../utils/migration.util';
import { LogTypeEnum } from '../interfaces/log-type.enum';

export class AddLogTable1725686518149 implements MigrationInterface {
  tableName = 'logs';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        "logId" BIGSERIAL PRIMARY KEY,
        "message" TEXT NOT NULL,
        "type" VARCHAR(255) NOT NULL,
        "timestampAdded" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${this.tableName} (message, type)
      VALUES
      ('Test log entry 1', '${LogTypeEnum.General}'),
      ('Test log entry 2', '${LogTypeEnum.General}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropTable(queryRunner, this.tableName);
  }
}
