import { ConflictException, NotFoundException } from '@nestjs/common';
import { SqlErrorNumberEnum } from '../enums/sql-error-number.enum';

/**
 * Handles foreign key not found error in MySQL (foreign key constraint violation).
 * Useful for handling errors when trying to insert or update a record with a foreign key that does not exist.
 */
export const handleForeignKeyError = (error: any) => {
  // If the error is not related to foreign key constraints, rethrow the original error
  if (error.errno !== SqlErrorNumberEnum.ForeignKeyNotFound) {
    throw error;
  }
  const regex = /REFERENCES\s+`([^`]+)`\s+\(`([^`]+)`\)/;
  const matches = error?.sqlMessage?.match(regex);
  const referenceColumn = matches?.[2];
  throw new NotFoundException(`${referenceColumn}_not_found`);
};

/**
 * Handles duplicate entry error in MySQL (unique constraint violation).
 * Useful for handling errors when trying to insert duplicate record having unique constraint.
 */
export const handleDuplicateEntryError = (error: any) => {
  // If the error is not related to unique constraint violation, rethrow the original error
  if (error.errno !== SqlErrorNumberEnum.DuplicateEntry) {
    throw error;
  }
  const regex = /for key '([^']+)'/;
  const matches = error?.sqlMessage?.match(regex);
  const constraintName = matches?.[1];
  const parts = constraintName?.split('_');
  const column = parts?.[parts.length - 2];
  const errorMessage = column ? `${column}_already_exists` : 'already_exists';
  throw new ConflictException(errorMessage);
};
