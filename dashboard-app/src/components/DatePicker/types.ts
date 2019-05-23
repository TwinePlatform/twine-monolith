import moment from 'moment';


type DatePickerConstraint = {
  min: (from: Date, to: Date) => Date
  max: (from: Date, to: Date) => Date
  default: () => Date
  validate: (from: Date, to: Date) => Date
};

export type DateRangePickerConstraint = {
  from: DatePickerConstraint
  to: DatePickerConstraint
};

export const MIN_DATE = moment('2017-01-01');
