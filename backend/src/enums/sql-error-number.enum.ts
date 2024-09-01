/** SQL error numbers (errno) */
export enum SqlErrorNumberEnum {
  /** Occurs when inserting a duplicate entry (unique constraint violation) */
  DuplicateEntry = 1062,

  /** Occurs when adding/ updating a child row and foreign key is not found (foreign key constraint violation) */
  ForeignKeyNotFound = 1452,
}
