import { NotFoundException } from '@nestjs/common';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Pagination } from './pagination.util';

const notFoundMessage = 'not_found';

/** Returns a general API response */
export const generalResponse = (message: string, data?: unknown) => {
  return {
    message,
    data
  };
};

/** Returns a API response based on the provided data and optional pagination metadata. */
export const getResponse = (data: unknown, meta?: Pagination) => {
  if (!data) {
    throw new NotFoundException(notFoundMessage);
  }

  return {
    message: 'success',
    data,
    meta
  };
};

/** Returns a API response based on the results of insert operations. */
export const insertResponse = (...results: InsertResult[]) => {
  const data: Record<string, any> = {};
  results.forEach((result) => {
    const identifier = result.identifiers[0];
    for (const [key, value] of Object.entries(identifier)) {
      data[key] = value;
    }
  });
  return {
    message: 'created',
    data
  };
};

/** Handle API responses based on the result of update or delete operations. */
const handleResponse = (result: UpdateResult | DeleteResult, successMessage: string) => {
  if (result?.affected && result.affected > 0) {
    return { message: successMessage };
  }
  throw new NotFoundException(notFoundMessage);
};

/** Returns a API response based on the number of rows updated. */
export const updateResponse = (updateResult: UpdateResult) => {
  return handleResponse(updateResult, 'updated');
};

/** Returns a API response based on the number of rows deleted. */
export const deleteResponse = (deleteResult: DeleteResult) => {
  return handleResponse(deleteResult, 'deleted');
};
