import { NotFoundException } from '@nestjs/common';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Pagination } from './pagination.util';
import { UpdateResponse } from '../interfaces/update-response.interface';

const notFoundMessage = 'not_found';
const updateMessage = 'updated';

/** Returns a general API response */
export const generalResponse = (message: string, data?: object) => {
  return {
    message,
    data
  };
};

/** Returns an API response based on the provided data and optional pagination metadata. */
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

/** Returns an API response based on the results of insert operations. */
export const insertResponse = (...results: InsertResult[]) => {
  const data: Record<string, unknown> = {};
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
  const { affected } = result;
  if (affected === 0) {
    throw new NotFoundException(notFoundMessage);
  }
  return {
    message: successMessage,
    meta: {
      affected
    }
  };
};

/** Returns an API response based on the number of rows updated. */
export const updateResponse = (updateResult: UpdateResult) => {
  return handleResponse(updateResult, updateMessage);
};

/**
 * Returns an API response based on the number of rows updated in each result.
 * Useful when updating data in multiple tables.
 */
export const multiUpdateResponse = (result: UpdateResponse) => {
  const response: Record<string, unknown> = {};
  let totalAffected = 0;

  for (const key in result) {
    const { affected } = result[key];
    response[key] = affected;
    if (affected) {
      totalAffected += affected;
    }
  }

  if (totalAffected === 0) {
    throw new NotFoundException(notFoundMessage);
  }
  return {
    message: updateMessage,
    meta: {
      affected: response,
      totalAffected
    }
  };
};

/** Returns an API response based on the number of rows deleted. */
export const deleteResponse = (deleteResult: DeleteResult) => {
  return handleResponse(deleteResult, 'deleted');
};
