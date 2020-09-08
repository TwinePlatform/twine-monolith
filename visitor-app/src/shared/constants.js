/*
 * Utility methods to perform common ops with constant values like:
 *  - Birth year
 *  - Gender
 *  - Disability
 *  - Etc
 */
import moment from 'moment';


const capitaliseFirstWord = s => s.replace(/^\w/, str => str.toUpperCase());

export const BirthYear = {
  NULL_VALUE: 'Prefer not to say',
  MINOR_AGE: 13,

  getBoundaryYear: () => new Date().getFullYear() - BirthYear.MINOR_AGE,

  // list :: (Number, Number, ['desc' | 'asc']) -> [Number]
  list: (start, end, order = 'desc') =>
    Array.from({ length: (end + 1) - start }, (v, i) => (order === 'desc') ? end - i : start + i),

  // listToOptions :: (Number) -> [{ key: string, value: string }]
  listToOptions: years =>
    [
      { key: '', value: '' },
      { key: BirthYear.NULL_VALUE, value: BirthYear.NULL_VALUE },
    ]
      .concat(
        years.map(y => ({ key: String(y), value: String(y) })),
      ),

  // defaultOptionsList :: () -> [{ key: string, value: string }]
  defaultOptionsList: () =>
    BirthYear.listToOptions(
      BirthYear.list(BirthYear.getBoundaryYear() - 100, BirthYear.getBoundaryYear()),
    ),

  u13OptionsList: () =>
    BirthYear.listToOptions(
      BirthYear.list(BirthYear.getBoundaryYear(), new Date().getFullYear()),
    ),

  fullOptionsList: () =>
    BirthYear.listToOptions(
      BirthYear.list(BirthYear.getBoundaryYear() - 100, new Date().getFullYear()),
    ),

  // toAge :: Number | null -> Number | null
  toAge: year =>
    year === null ? null : moment().year() - year,

  // fromAge :: Number | null -> Number | null
  fromAge: age =>
    age === null ? null : moment().year() - age,

  // toDisplay :: Number | null -> String
  toDisplay: year =>
    year === null ? BirthYear.NULL_VALUE : year,

  // fromDisplay :: String -> Number | null
  fromDisplay: year =>
    year === BirthYear.NULL_VALUE ? null : year,
};

export const AgeRange = {
  UPPER_LIMIT: 999,

  // fromStr :: String -> [Number, Number]
  fromStr: (str) => {
    if (str === BirthYear.NULL_VALUE) return str;

    if (!/^(\d{1,3}-\d{1,3}|\d{1,3}\+)$/.test(str)) {
      throw new Error(`Invalid age range: ${str}`);
    }

    const x = str
      .split(/[-+]/)
      .map(d => parseInt(d, 10))
      .filter(d => !isNaN(d))
      .concat(AgeRange.UPPER_LIMIT)
      .slice(0, 2);

    if (x.length !== 2) {
      throw new Error(`Invalid age range: ${str}`);
    }

    return x;
  },

  // toStr :: [Number, Number] -> String
  toStr: ([min, max]) => {
    if (typeof min === 'undefined' || typeof max === 'undefined') {
      throw new Error(`Invalid age range: [${[min, max]}]`);
    }

    return (max && max >= AgeRange.UPPER_LIMIT)
      ? `${min}+`
      : `${min}-${max}`;
  },
};

export const createAgeGroups = (groups) => {
  const ranges = groups.map(AgeRange.fromStr);

  return {
    fromBirthYear: (year) => {
      if (year === null || year === BirthYear.NULL_VALUE) return BirthYear.toDisplay(null);

      const age = BirthYear.toAge(year);
      const range = ranges.find(([min, max]) => min <= age && age <= max);
      return AgeRange.toStr(range);
    },
    toSelectOptions: () => ['All'].concat(groups).map((value, key) => ({ key, value })),
  };
};

export const Gender = {
  // toDisplay :: String -> String
  toDisplay: capitaliseFirstWord,

  // fromDisplay :: String -> String
  fromDisplay: s => s.toLowerCase(),
};
