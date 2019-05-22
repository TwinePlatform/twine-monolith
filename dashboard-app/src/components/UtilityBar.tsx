import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import DatePicker from './DatePicker';
import UnitToggle from './UnitToggle';
import { DurationUnitEnum } from '../types';
import { DownloadButton } from './Buttons';
import { DateRangePickerConfig } from './DatePicker/constraints'


/**
 * Types
 */
type DateFilterType = 'day' | 'month';

type UtilityBarProps = {
  dateFilter: DateFilterType
  datePickerConfig: DateRangePickerConfig
  onFromDateChange?: (d: Date) => void
  onToDateChange?: (d: Date) => void
  onUnitChange?: (u: DurationUnitEnum) => void
  onDownloadClick?: () => void
};


/**
 * Component
 */
const UtilityBar: React.FunctionComponent<UtilityBarProps> = (props) => {
  const {
    dateFilter,
    datePickerConfig: cfg,
    onFromDateChange = () => {},
    onToDateChange = () => {},
    onUnitChange = () => {},
    onDownloadClick = () => {},
    ...rest
  } = props;

  const [fromDate, setFromDate] = useState(cfg.from.default());
  const [toDate, setToDate] = useState(cfg.to.default());
  const [unit, setUnit] = useState<DurationUnitEnum>(DurationUnitEnum.HOURS);

  const onFromChange = useCallback((date: Date) => {
    const fd = cfg.from.validate(date, toDate);
    setFromDate(fd);
    onFromDateChange(fd);

    const td = cfg.to.validate(fd, toDate);
    if (! moment(td).isSame(toDate)) {
      setToDate(td);
      onToDateChange(td);
    }
  }, [fromDate, toDate]);

  const onToChange = useCallback((date: Date) => {
    const td = cfg.to.validate(fromDate, date);
    setToDate(td);
    onToDateChange(td);
  }, [fromDate, toDate]);

  const onDisplayUnitChange = useCallback((u: DurationUnitEnum) => {
    setUnit(u);
    onUnitChange(u);
  }, [unit]);

  console.log(cfg.to.max(fromDate, toDate));

  return (
    <Row middle="xs" start="xs" {...rest}>
      <Col xs={6}>
        <Row>
          <DatePicker
            type={dateFilter}
            label="From"
            selected={fromDate}
            onChange={onFromChange}
            minDate={cfg.from.min(fromDate, toDate)}
            maxDate={cfg.from.max(fromDate, toDate)}
          />
          <DatePicker
            type={dateFilter}
            label="  To" // To make both labels take up the same space
            selected={toDate}
            onChange={onToChange}
            minDate={cfg.to.min(fromDate, toDate)}
            maxDate={cfg.to.max(fromDate, toDate)}
          />
        </Row>
      </Col>
      <Col xs={6}>
        <Row end="xs">
          <UnitToggle onChange={onDisplayUnitChange}/>
          <DownloadButton onClick={onDownloadClick}>Download</DownloadButton>
        </Row>
      </Col>
    </Row>
  );
};

export default UtilityBar;
