
type DatePickerConfig = {
  min: (from: Date, to: Date) => Date
  max: (from: Date, to: Date) => Date
  default: () => Date
  validate: (from: Date, to: Date) => Date
};

export type DateRangePickerConfig = {
  from: DatePickerConfig
  to: DatePickerConfig
};
