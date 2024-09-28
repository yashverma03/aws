import { Transform } from 'class-transformer';
import { removeDuplicates } from '../utils/array.util';

/** A custom decorator to remove duplicate values from an array */
export const RemoveDuplicates = () => {
  return Transform(({ value }) => removeDuplicates(value));
};
