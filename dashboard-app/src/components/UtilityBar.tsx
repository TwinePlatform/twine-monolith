import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import DatePicker from './DatePicker';
import Toggle from './Toggle';


type UnitToggleProps = {
  onChange: (u: 'Hours' | 'Days') => void
};

const UnitToggle: React.FunctionComponent<UnitToggleProps> = (props) => (
  <Toggle
    left="Hours"
    right="Days"
    onChange={(s) => props.onChange(s === 'Hours' ? 'Hours' : 'Days')}
  />
);


type UtilityBarProps = {
  onFromDateChange?: (d: Date) => void
  onToDateChange?: (d: Date) => void
  onUnitChange?: (u: 'Hours' | 'Days') => void
};


const Tooltip = styled.div`
  background: red;

  &:hover {
    opacity: 0.8;
  }
`;


const UtilityBar: React.FunctionComponent<UtilityBarProps> = (props) => {
  const {
    onFromDateChange = console.log,
    onToDateChange = console.log,
    onUnitChange = console.log,
  } = props;

  const [fromDate, setFromDate] = useState(moment().subtract(11, 'months').toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [unit, setUnit] = useState<'Hours' | 'Days'>('Hours');

  const onFromChange = useCallback((date: Date) => {
    setFromDate(date);
    onFromDateChange(date);
  }, [fromDate]);

  const onToChange = useCallback((date: Date) => {
    setToDate(date);
    onToDateChange(date);
  }, [toDate]);

  const onDisplayUnitChange = useCallback((unit: 'Hours' | 'Days') => {
    setUnit(unit);
    onUnitChange(unit);
  }, [unit]);

  return (
    <Row middle="xs" start="xs">
      <Col xs={2}>
        <DatePicker
          label="From"
          selected={fromDate}
          onChange={onFromChange}
          maxDate={moment().subtract(1, 'month').toDate()}
          minDate={moment().subtract(11, 'months').toDate()}
        />
      </Col>
      <Col xs={2}>
        <DatePicker
          label="To"
          selected={toDate}
          onChange={onToChange}
          maxDate={moment().toDate()}
          minDate={moment().subtract(10, 'months').toDate()}
        />
      </Col>
      <Col xs={2} xsOffset={6}>
        <UnitToggle onChange={onDisplayUnitChange} />
        <Tooltip title="Foo"/>
      </Col>
    </Row>
  );
};

export default UtilityBar;
