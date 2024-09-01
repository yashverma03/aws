import { QueryRunner, TableForeignKey, TableIndex } from 'typeorm';

const { DB_DATABASE } = process.env;

/**
 * Adds a column to a table if it does not already exist.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to modify.
 * @param {string} columnName - The name of the column to add.
 * @param {string} columnType - The SQL type definition for the column.
 * @returns {Promise<void>} A promise that resolves once the column is added.
 */
export const addColumn = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
  columnType: string,
) => {
  const hasColumn = await queryRunner.hasColumn(tableName, columnName);
  if (!hasColumn) {
    await queryRunner.query(`
      ALTER TABLE ${tableName}
      ADD COLUMN ${columnName} ${columnType};
    `);
  }
};

/**
 * Drops a column from a table if it exists.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to modify.
 * @param {string} columnName - The name of the column to drop.
 * @returns {Promise<void>} A promise that resolves once the column is dropped.
 */
export const dropColumn = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
) => {
  const hasColumn = await queryRunner.hasColumn(tableName, columnName);
  if (hasColumn) {
    await queryRunner.query(`
      ALTER TABLE ${tableName}
      DROP COLUMN ${columnName};
    `);
  }
};

/**
 * Modifies a column in a table.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to modify.
 * @param {string} columnName - The name of the column to modify.
 * @param {string} columnType - The new SQL type definition for the column.
 * @returns {Promise<void>} A promise that resolves once the column is modified.
 */
export const modifyColumn = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
  columnType: string,
): Promise<void> => {
  const hasColumn = await queryRunner.hasColumn(tableName, columnName);
  if (hasColumn) {
    await queryRunner.query(`
      ALTER TABLE ${tableName}
      MODIFY ${columnName} ${columnType};
    `);
  }
};

/** Drops a table if it exists. */
export const dropTable = async (
  queryRunner: QueryRunner,
  tableName: string,
) => {
  await queryRunner.query(`DROP TABLE IF EXISTS ${tableName}`);
};

/**
 * Checks if a specific constraint exists on a specified table. Useful for foreign key, unique and check contraints.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to check.
 * @param {string} constraintName - The name of the constraint to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the constraint exists, otherwise false.
 */
const constraintExists = async (
  queryRunner: QueryRunner,
  tableName: string,
  constraintName: string,
) => {
  const result = await queryRunner.query(`
    SELECT COUNT(*) AS count
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_NAME = '${tableName}'
      AND CONSTRAINT_NAME = '${constraintName}'
      AND TABLE_SCHEMA = '${DB_DATABASE}'
  `);
  return result?.[0]?.count > 0;
};

/**
 * Drops a foreign key constraint from a specified table if it exists.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table from which the foreign key constraint should be dropped.
 * @param {string} foreignKeyName - The name of the foreign key constraint to drop.
 * @returns {Promise<void>} A promise that resolves when the foreign key constraint is dropped.
 */
export const dropForeignKey = async (
  queryRunner: QueryRunner,
  tableName: string,
  foreignKeyName: string,
) => {
  const hasConstraint = await constraintExists(
    queryRunner,
    tableName,
    foreignKeyName,
  );
  if (hasConstraint) {
    await queryRunner.dropForeignKey(tableName, foreignKeyName);
  }
};

/**
 * Adds a foreign key constraint to a specified table if it does not already exist.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to which the foreign key constraint should be added.
 * @param {string} columnName - The name of the column to which the foreign key constraint should be added.
 * @param {string} referencedTableName - The name of the table to which the column should be a foreign key.
 * @param {string} referencedColumnName - The name of the column in the referenced table.
 * @param {string} foreignKeyName - The name of the foreign key constraint to add.
 * @returns {Promise<void>} A promise that resolves when the foreign key constraint is added.
 */
export const addForeignKey = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
  referencedTableName: string,
  referencedColumnName: string,
  foreignKeyName: string,
) => {
  const hasConstraint = await constraintExists(
    queryRunner,
    tableName,
    foreignKeyName,
  );
  if (!hasConstraint) {
    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: [columnName],
        referencedTableName,
        referencedColumnNames: [referencedColumnName],
        name: foreignKeyName,
      }),
    );
  }
};

/**
 * Checks if a specific index exists on a specified table.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to check.
 * @param {string} indexName - The name of the index to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the index exists, otherwise false.
 */
const indexExists = async (
  queryRunner: QueryRunner,
  tableName: string,
  indexName: string,
) => {
  const result = await queryRunner.query(`
    SELECT COUNT(*) AS count
    FROM information_schema.STATISTICS
    WHERE TABLE_NAME = '${tableName}'
      AND INDEX_NAME = '${indexName}'
      AND TABLE_SCHEMA = '${DB_DATABASE}'
  `);
  return result?.[0]?.count > 0;
};

/**
 * Drops an index from a specified table if it exists. *
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table from which the index should be dropped.
 * @param {string} indexName - The name of the index to drop.
 * @returns {Promise<void>} A promise that resolves when the index is dropped.
 */
export const dropIndex = async (
  queryRunner: QueryRunner,
  tableName: string,
  indexName: string,
) => {
  const hasIndex = await indexExists(queryRunner, tableName, indexName);
  if (hasIndex) {
    await queryRunner.dropIndex(tableName, indexName);
  }
};

/**
 * Adds an index to a specified table if it does not already exist.
 * @param {QueryRunner} queryRunner - The TypeORM QueryRunner instance.
 * @param {string} tableName - The name of the table to which the index should be added.
 * @param {string} indexName - The name of the index to add.
 * @param {string} columnName - The name of the column to index.
 * @returns {Promise<void>} A promise that resolves when the index is added.
 */
export const addIndex = async (
  queryRunner: QueryRunner,
  tableName: string,
  indexName: string,
  columnName: string,
) => {
  const hasIndex = await indexExists(queryRunner, tableName, indexName);
  if (!hasIndex) {
    const index = new TableIndex({
      name: indexName,
      columnNames: [columnName],
    });
    await queryRunner.createIndex(tableName, index);
  }
};

/**
 * Retrieves the collation of a specific column in a table. Defaults to 'utf8mb4_unicode_ci'.
 *
 * Useful when adding a foreign key constraint to a column having the following SQL types:
 * CHAR, VARCHAR, TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT, ENUM, SET.
 * @param {QueryRunner} queryRunner - The TypeORM query runner instance.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column.
 * @returns {Promise<string>} The collation of the column.
 */
export const getCollation = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
): Promise<string> => {
  const defaultCollation = 'utf8mb4_unicode_ci';
  const result = await queryRunner.query(`
    SELECT COLLATION_NAME AS collation
    FROM information_schema.COLUMNS
    WHERE TABLE_NAME = '${tableName}'
      AND COLUMN_NAME = '${columnName}'
      AND TABLE_SCHEMA = '${DB_DATABASE}'
  `);
  return result?.[0]?.collation ?? defaultCollation;
};
