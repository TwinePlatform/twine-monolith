import React from 'react';
import styled from 'styled-components';
import { SelectContainer } from '../Select';
import { ColoursEnum } from '../../styles/design_system';


/**
 * Types
 */
interface DateSelectorProps {
  label: string;
  inline?: boolean;
  value?: any;
  onClick?: any;
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
  color: ${ColoursEnum.black};
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

export default DateSelector;
