import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import DatePicker from './DatePicker';
import UnitToggle from './UnitToggle';


type DurationUnit = 'Hours' | 'Days';
type DateFilterType = 'day' | 'month';


type UtilityBarProps = {
  dateFilter: DateFilterType
  onFromDateChange?: (d: Date) => void
  onToDateChange?: (d: Date) => void
  onUnitChange?: (u: DurationUnit) => void
};


const UtilityBar: React.FunctionComponent<UtilityBarProps> = (props) => {
  const {
    dateFilter,
    onFromDateChange = console.log,
    onToDateChange = console.log,
    onUnitChange = console.log,
  } = props;

  const [fromDate, setFromDate] = useState(moment().subtract(11, 'months').toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [unit, setUnit] = useState<DurationUnit>('Hours');

  const onFromChange = useCallback((date: Date) => {
    setFromDate(date);
    onFromDateChange(date);
  }, [fromDate]);

  const onToChange = useCallback((date: Date) => {
    setToDate(date);
    onToDateChange(date);
  }, [toDate]);

  const onDisplayUnitChange = useCallback((unit: DurationUnit) => {
    setUnit(unit);
    onUnitChange(unit);
  }, [unit]);

  return (
    <Row middle="xs" start="xs">
      <Col xs={2}>
        <DatePicker
          type={dateFilter}
          label="From"
          selected={fromDate}
          onChange={onFromChange}
          maxDate={moment().subtract(1, 'month').toDate()}
          minDate={moment().subtract(11, 'months').toDate()}
        />
      </Col>
      <Col xs={2}>
        <DatePicker
          type={dateFilter}
          label="To"
          selected={toDate}
          onChange={onToChange}
          maxDate={moment().toDate()}
          minDate={moment().subtract(10, 'months').toDate()}
        />
      </Col>
      <Col xs={2} xsOffset={6}>
        <UnitToggle onChange={onDisplayUnitChange}/>
      </Col>
    </Row>
  );
};

export default UtilityBar;
