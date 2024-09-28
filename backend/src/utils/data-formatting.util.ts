/**
 * Groups data based on 'keysToGroup' and remaining key-value pairs under 'keyForRemainingValues'.
 * @param {Record<string, any>[]} ungroupedData - The array of objects to be grouped.
 * @param {string[]} keysToGroup - The keys to be extracted and grouped.
 * @param {string} keyForRemainingValues - The key under which the remaining values will be stored.
 * @returns {Record<string, any>[]} The array of newly structured objects.
 */
export const groupData = (
  ungroupedData: Record<string, any>[],
  keysToGroup: string[],
  keyForRemainingValues: string
) => {
  return ungroupedData.map((item) => {
    // Initially, copy all values under 'keyForRemainingValues '
    const groupedData = {
      [keyForRemainingValues]: item
    };

    keysToGroup.forEach((prop) => {
      // Copy the property value to groupedData
      groupedData[prop] = item[prop];

      // Remove the property stored under 'keyForRemainingValues '
      delete groupedData[keyForRemainingValues][prop];
    });

    return groupedData;
  });
};

/**
 * Transforms an array of fields into an array of orderBy strings with ASC and DESC suffixes.
 * @param orderBy - Array of fields to transform.
 * @param separator - Optional separator to use between field and order ('ASC' or 'DESC'). Default is '_'.
 * @returns Transformed array of orderBy strings.
 */
export const getOrderBy = (orderBy: string[], separator = '_') => {
  const transformedOrderBy: string[] = [];

  orderBy.forEach((field) => {
    transformedOrderBy.push(`${field}${separator}ASC`);
    transformedOrderBy.push(`${field}${separator}DESC`);
  });

  return transformedOrderBy;
};

/**
 * Groups data from an array of objects into nested objects based on table and column names.
 * Useful in TypeORM getRawOne() and getRawMany() with join queries where data is returned in a flat structure.
 */
export const groupDataByTable = (data: Record<string, any>[]) => {
  const groupedData: Record<string, Record<string, unknown>>[] = [];

  for (const item of data) {
    const groupedItem: Record<string, Record<string, unknown>> = {};

    for (const key in item) {
      const [tableName, columnName] = key.split('_');
      if (!groupedItem[tableName]) {
        groupedItem[tableName] = {};
      }
      groupedItem[tableName][columnName] = item[key];
    }

    groupedData.push(groupedItem);
  }

  return groupedData;
};
