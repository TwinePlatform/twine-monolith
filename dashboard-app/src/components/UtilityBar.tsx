import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import DatePicker from './DatePicker';
import UnitToggle from './UnitToggle';
import { DurationUnitEnum } from '../types';


/**
 * Types
 */
type DateFilterType = 'day' | 'month';

type UtilityBarProps = {
  dateFilter: DateFilterType
  onFromDateChange?: (d: Date) => void
  onToDateChange?: (d: Date) => void
  onUnitChange?: (u: DurationUnitEnum) => void
};


/**
 * Component
 */
const UtilityBar: React.FunctionComponent<UtilityBarProps> = (props) => {
  const {
    dateFilter,
    onFromDateChange = () => {},
    onToDateChange = () => {},
    onUnitChange = () => {},
    ...rest
  } = props;

  const [fromDate, setFromDate] = useState(moment().subtract(11, 'months').toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [unit, setUnit] = useState<DurationUnitEnum>(DurationUnitEnum.HOURS);

  const onFromChange = useCallback((date: Date) => {
    const fd = moment(date).startOf('month').toDate();
    setFromDate(fd);
    onFromDateChange(fd);

    if (moment(date).add(11, 'months').isBefore(toDate)) {
      const td = moment(date).add(11, 'months').endOf('month').toDate();
      setToDate(td);
      onToDateChange(td);
    }
  }, [fromDate]);

  const onToChange = useCallback((date: Date) => {
    const td = moment(date).endOf('month').toDate();
    setToDate(td);
    onToDateChange(td);
  }, [toDate]);

  const onDisplayUnitChange = useCallback((u: DurationUnitEnum) => {
    setUnit(u);
    onUnitChange(u);
  }, [unit]);

  return (
    <Row middle="xs" start="xs" {...rest}>
      <Col xs={2}>
        <DatePicker
          type={dateFilter}
          label="From"
          selected={fromDate}
          onChange={onFromChange}
        />
      </Col>
      <Col xs={2}>
        <DatePicker
          type={dateFilter}
          label="  To" // To make both labels take up the same space
          selected={toDate}
          onChange={onToChange}
          maxDate={moment(fromDate).add(11, 'months').toDate()}
          minDate={fromDate}
        />
      </Col>
      <Col xs={2} xsOffset={6}>
        <UnitToggle onChange={onDisplayUnitChange}/>
      </Col>
    </Row>
  );
};

export default UtilityBar;
