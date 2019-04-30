import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
import Select, { FakeSelect } from '../Select';


interface DatePickerProps extends ReactDatePickerProps {
}


const Selectah = (props: any) => (
  <FakeSelect
    onClick={props.onClick}
    value={props.value}
    label="From"
    inline
    options={[]}
  />
)


const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
  return (
    <ReactDatePicker
      dateFormat="MM/yyyy"
      showMonthYearPicker
      customInput={<Selectah />}
      {...props}
    />
  );
};


export default DatePicker;
