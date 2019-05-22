
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
