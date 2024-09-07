import { MigrationInterface, QueryRunner } from 'typeorm';
import { dropTable } from '../utils/migration.util';

export class AddLogTable1725686518149 implements MigrationInterface {
  tableName = 'logs';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        "logId" BIGSERIAL PRIMARY KEY,
        "message" TEXT NOT NULL,
        "timestampAdded" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${this.tableName} (message)
      VALUES
      ('Test log entry 1'),
      ('Test log entry 2');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropTable(queryRunner, this.tableName);
  }
}
