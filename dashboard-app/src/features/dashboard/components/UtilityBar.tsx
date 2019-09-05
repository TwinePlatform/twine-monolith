import React, { useState, useCallback, useContext } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import DatePicker from './DatePicker';
import UnitToggle from './UnitToggle';
import { DurationUnitEnum } from '../../../types';
import { DownloadButton } from '../../../lib/ui/components/Buttons';
import { DateRangePickerConstraint } from './DatePicker/types';
import { DashboardContext } from '../../../App';


/**
 * Types
 */
type DateFilterType = 'day' | 'month';

type UtilityBarProps = {
  dateFilter: DateFilterType
  datePickerConstraint: DateRangePickerConstraint
  onFromDateChange?: (d: Date) => void
  onToDateChange?: (d: Date) => void
  onUnitChange?: (u: DurationUnitEnum) => void
  onDownloadClick?: () => void
};


/*
 * Styles
 */
const MainRow = styled(Row)`
  margin-bottom: 2rem;
`;

/**
 * Component
 */
const UtilityBar: React.FunctionComponent<UtilityBarProps> = (props) => {
  const {
    dateFilter,
    datePickerConstraint: constraint,
    onFromDateChange = () => { },
    onToDateChange = () => { },
    onUnitChange = () => { },
    onDownloadClick = () => { },
    ...rest
  } = props;

  const [fromDate, setFromDate] = useState(constraint.from.default());
  const [toDate, setToDate] = useState(constraint.to.default());
  const { setUnit } = useContext(DashboardContext);

  const onFromChange = useCallback((date: Date) => {
    const fd = constraint.from.validate(date, toDate);
    setFromDate(fd);
    onFromDateChange(fd);

    const td = constraint.to.validate(fd, toDate);
    if (!moment(td).isSame(toDate)) {
      setToDate(td);
      onToDateChange(td);
    }
  }, [constraint.from, constraint.to, onFromDateChange, onToDateChange, toDate]);

  const onToChange = useCallback((date: Date) => {
    const td = constraint.to.validate(fromDate, date);
    setToDate(td);
    onToDateChange(td);
  }, [constraint.to, fromDate, onToDateChange]);

  const onDisplayUnitChange = useCallback((u: DurationUnitEnum) => {
    setUnit(u);
    onUnitChange(u);
  }, [onUnitChange, setUnit]);

  return (
    <MainRow middle="xs" start="xs" {...rest}>
      <Col xs={6}>
        <DatePicker
          type={dateFilter}
          label="From"
          selected={fromDate}
          onChange={onFromChange}
          minDate={constraint.from.min(fromDate, toDate)}
          maxDate={constraint.from.max(fromDate, toDate)}
        />
        <DatePicker
          type={dateFilter}
          label="  To" // To make both labels take up the same space
          selected={toDate}
          onChange={onToChange}
          minDate={constraint.to.min(fromDate, toDate)}
          maxDate={constraint.to.max(fromDate, toDate)}
        />
      </Col>
      <Col xs={6}>
        <Row end="xs">
          <UnitToggle onChange={onDisplayUnitChange} />
          <DownloadButton onClick={onDownloadClick}>Download</DownloadButton>
        </Row>
      </Col>
    </MainRow>
  );
};

export default UtilityBar;
