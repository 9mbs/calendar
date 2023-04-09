/**
 * Determines whether a given year is a valid year between 1900 and 2100.
 *
 * @param {number} year - The year to validate (e.g. 2023).
 * @returns {boolean} True if the year is valid, false otherwise.
 */
const isValidYear = (year) => {
  if (!Number.isFinite(year)) {
    return false;
  }

  const yStr = year.toString();

  if (yStr.length !== 4 || year < 1900 || year > 2100) {
    return false;
  }
  return true;
};

/**
 * Determines whether a given month is a valid month between 1 and 12.
 *
 * @param {number} month - The month to validate (1-12).
 * @returns {boolean} True if the month is valid, false otherwise.
 */
const isValidMonth = (month) => {
  if (typeof month === 'number' && !isNaN(month) && month >= 1 && month <= 12) {
    return true;
  }
  return false;
};

/**
 * Calculates the number of days in a given month and year.
 *
 * @param {number} year - The year for which to calculate the number of days (e.g. 2023).
 * @param {number} month - The month for which to calculate the number of days (1-12).
 * @returns {number} The number of days in the specified month and year.
 */
const getDaysInMonth = (year, month) => {
  const validYear = isValidYear(year);
  const validMonth = isValidMonth(month);
  
  if (validYear === false || validMonth === false) {
    throw new Error('Invalid year or month. Year must be between 1900 and 2100, and month must be between 1 and 12.');
  }

  return new Date(year, month, 0).getDate();
};

/**
 * Determines whether a given day is a valid day between 1 and 31.
 *
 * @param {number} day - The day to validate (1-31).
 * @returns {boolean} True if the day is valid, false otherwise.
 */
const isValidDay = (day) => {
  if (typeof day === 'number' && !isNaN(day) && day >= 1 && day <= 31) {
    return true;
  }
  return false;
};

/**
 * Formats a date in a locale-specific format.
 *
 * @param {number} month - The month of the date (1-12).
 * @param {number} day - The day of the date (1-31).
 * @param {number} year - The year of the date (e.g. 2023).
 * @param {string} [locale] - The locale to use when formatting the date. Defaults to the user's locale.
 * @param {Object} [options] - Additional options to pass to the `toLocaleDateString` method. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString for more information.
 * @returns {string} A formatted date string in a locale-specific format.
 */
const formatDate = (month, day, year, locale = undefined, options) => {
  const validMonth = isValidMonth(month);
  const validYear = isValidYear(year);
  const validDay = isValidDay(day);

  if (validMonth === false) {
    throw new Error('Invalid month. Month must be between 1 and 12.');
  }
  if (validYear === false) {
    throw new Error('Invalid year. Year must be between 1900 and 2100.');
  }
  if (validDay === false) {
    throw new Error('Invalid day. The day must be between 1 and 31.');
  }
  if (typeof locale !== 'undefined' && typeof locale !== 'string') {
    throw new Error('Invalid locale. The locale must be a string.');
  }

  const date = new Date(year, month - 1, day); // Month index starts from 0
  const localeOptions = options || { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString(locale, localeOptions);
};

/**
 * Generates an array of formatted date strings representing each day in a given month and year.
 *
 * @param {number} year - The year for which to generate the list of days (e.g. 2023).
 * @param {number} month - The month for which to generate the list of days (1-12).
 * @returns {Array} An array of formatted date strings representing each day in the specified month and year.
 */
const listDaysInMonth = (year, month) => {
  if (!isValidMonth(month)) {
    throw new Error(`Invalid month: ${month}. The month must be an integer between 1 and 12.`);
  }

  if (!isValidYear(year)) {
    throw new Error(`Invalid year: ${year}. The year must be a valid year between 1900 and 2100.`);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  let dates = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = formatDate(month, day, year);
    dates.push(formattedDate);
  }

  return dates;
};

const months$1 = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre'
];

const locale = {
  'en-US': {
    months: months$1
  },
  es: {
    months: months
  }
};

/**
 * Generates an object representing a calendar year with the number of days and a list of days for each month.
 *
 * @param {number} year - The year for which to generate the calendar (e.g. 2023).
 * @returns {object} An object representing a calendar year with the number of days and a list of days for each month.
 * @throws {object} An error object with a message if the year is not a valid year between 1900 and 2100.
 */
const getCalendarYear = (year, locale$1 = undefined) => {  
  const preferredLocale = locale$1 || 'en-US';

  if (!isValidYear(year)) {
    return {
      error: {
        body: 'The argument passed to `calendar(\'YYYY\')` must be a valid year between 1900 and 2100. You passed ' + year + '.',
      },
    };
  }

  return locale[preferredLocale].months.reduceRight((collector, current) => ({
    [current.toLowerCase()]: {
      count: getDaysInMonth(year, locale[preferredLocale].months.indexOf(current) + 1),
      collection: listDaysInMonth(year, locale[preferredLocale].months.indexOf(current) + 1)
    },
    ...collector
  }), {});
};

export { formatDate, getCalendarYear, getDaysInMonth, isValidDay, isValidMonth, isValidYear, listDaysInMonth, locale };
