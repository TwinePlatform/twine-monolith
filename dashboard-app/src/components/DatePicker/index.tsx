import React from 'react';
import styled from 'styled-components';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { SelectContainer } from '../Select';
import { ColoursEnum } from '../../styles/style_guide';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

/**
 * Types
 */
interface DateSelectorProps {
  label: string;
  inline?: boolean;
  value?: any;
  onClick?: any;
}

interface DatePickerProps extends ReactDatePickerProps {
  label: string;
  inline?: boolean;
}

/**
 * Additional Styles
 */
const Input = styled.input`
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  box-shadow: none;
  -ms-progress-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  color: ${ColoursEnum.grey};
`;


/**
 * Custom date selector
 *
 * Customises the selector element to mimic a <select> box
 */
const DateSelector: React.FunctionComponent<DateSelectorProps> = (props) => (
  <SelectContainer {...props}>
    <Input value={props.value} onClick={props.onClick} />
  </SelectContainer>
);


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
