import React, { useState, useCallback, useContext } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import DatePicker from './DatePicker';
import SearchPicker from './SearchPicker';
import UnitToggle from './UnitToggle';
import { DurationUnitEnum } from '../../../types';
import { DownloadButton } from '../../../lib/ui/components/Buttons';
import { DateRangePickerConstraint } from './DatePicker/types';
import { DashboardContext } from '../context';
import { ColoursEnum } from '../../../lib/ui/design_system';



/**
 * Types
 */
type DateFilterType = 'day' | 'month';

type UtilityBarProps = {
  dateFilter: DateFilterType
  datePickerConstraint: DateRangePickerConstraint
  customToggle?: React.ReactElement
  onFromDateChange?: (d: Date) => void
  onToDateChange?: (d: Date) => void
  onUnitChange?: (u: DurationUnitEnum) => void
  onDownloadClick?: () => void
  categories: any;
  filters: any;
  setCategories: any;
  setFilters: any;
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
const LogsUtilityBar: React.FunctionComponent<UtilityBarProps> = (props) => {
  const {
    dateFilter,
    datePickerConstraint: constraint,
    onFromDateChange = () => { },
    onToDateChange = () => { },
    onUnitChange = () => { },
    onDownloadClick = () => { },
    customToggle = null,
    categories,
    setCategories,
    filters,
    setFilters, 
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
      <Col xs={4}>
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
      <Col xs={4}>
      <Row>
          <div
            style={{display: 'flex', justifyContent: 'space-around'}}
          >
              <SearchPicker
                placeholder={"Category"}
                searches={categories}
                setSearches={setCategories}
                colour={ColoursEnum.orange}
              />
              <SearchPicker
                placeholder={"Filter"}
                searches={filters}
                setSearches={setFilters}
                colour={ColoursEnum.grey}
              />
          </div>
        </Row>
      </Col>
      <Col xs={4}>
        <Row end="xs" middle="xs">
          {customToggle}
          <UnitToggle onChange={onDisplayUnitChange} />
          <DownloadButton onClick={onDownloadClick}>Download</DownloadButton>
        </Row>
      </Col>
    </MainRow>
  );
};

export default LogsUtilityBar;
