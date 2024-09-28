import * as dayjs from 'dayjs';
import { BadRequestException } from '@nestjs/common';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

/**
 * Validates that the end date is after the start date and that both dates are valid.
 * Only validates if both dates are provided.
 */
export const validateDateRange = (
  startDateString: string | undefined,
  endDateString: string | undefined,
) => {
  if (!startDateString || !endDateString) {
    return;
  }

  const startDate = dayjs(startDateString, 'YYYY-MM-DD', true);
  const endDate = dayjs(endDateString, 'YYYY-MM-DD', true);

  // Check if either date is invalid
  if (!startDate.isValid() || !endDate.isValid()) {
    throw new BadRequestException('invalid_date_format');
  }

  // Check if endDate is before startDate
  if (endDate.isBefore(startDate)) {
    throw new BadRequestException('end_date_should_be_after_start_date');
  }
};

/** Get today's date in 'YYYY-MM-DD' format. */
export const getTodayDate = () => {
  return dayjs().format('YYYY-MM-DD');
};

/** Get yesterday's date in 'YYYY-MM-DD' format. */
export const getYesterdayDate = () => {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
};

/** Get the date six months ago from yesterday in 'YYYY-MM-DD' format. */
export const getSixMonthsAgoFromYesterday = () => {
  return dayjs().subtract(1, 'day').subtract(6, 'month').format('YYYY-MM-DD');
};

/** Get the first day of the previous month in 'YYYY-MM-DD' format. */
export const getFirstDayOfPrevMonth = () => {
  return dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
};

/** Get the last day of the previous month in 'YYYY-MM-DD' format. */
export const getLastDayOfPrevMonth = () => {
  return dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
};

/** Get the difference in months between two start and end dates. */
export const getMonthDifference = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'month');
};

/** Returns all date cycle based on the dueDate number, between startDate and endDate */
export const getDateCyclesInRange = (
  dueDate: number,
  startDate: string | null,
  endDate: string | null,
) => {
  if (!startDate || !endDate) {
    return null;
  }

  const dates: string[] = [];

  // Set the cycle date to the dueDate
  let startCycleDate = dayjs(startDate).date(dueDate);
  const endCycleDate = dayjs(endDate).date(dueDate);

  // If the startCycleDate is before the startDate, set it to the next month
  if (startCycleDate.isBefore(dayjs(startDate), 'day')) {
    startCycleDate = startCycleDate.add(1, 'month');
  }

  // Add all cycle dates between the start and end dates
  while (startCycleDate.isSameOrBefore(dayjs(endCycleDate), 'day')) {
    const formattedNextCycle = startCycleDate.format('YYYY-MM-DD');
    dates.push(formattedNextCycle);
    startCycleDate = startCycleDate.add(1, 'month');
  }

  return dates;
};
