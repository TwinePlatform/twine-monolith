import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import DateSelector from './Selector';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

/**
 * Types
 */
interface DatePickerProps extends ReactDatePickerProps {
  label: string;
  inline?: boolean;
}


/**
 * Component
 */
const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
  return (
    <ReactDatePicker
      dateFormat="MM/yyyy"
      showMonthYearPicker
      customInput={<DateSelector label={props.label} inline />}
      {...props}
    />
  );
};


export default DatePicker;
