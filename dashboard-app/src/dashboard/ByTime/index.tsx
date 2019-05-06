import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import { DataTableProps, DataTableRow } from '../../components/DataTable/types';
import useRequest from '../../util/hooks/useRequest';
import { DurationUnitEnum } from '../../types';
import DateRange from '../../util/dateRange';
import { timeLogsToTable } from './helper';
import UtilityBar from '../../components/UtilityBar';

export default () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState(moment().subtract(1, 'year').add(1, 'month').toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [tableProps, setTableProps] = useState<DataTableProps>();

  const { error, loading, data } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
  });

  useEffect(() => {
    if (data) {
      const startMonth = Number(moment(fromDate).format('M'));
      const duration = DateRange.monthsDifference(fromDate, toDate) + 1;
      const months = DateRange.getPastMonths(startMonth, duration);
      setTableProps(timeLogsToTable({ data, months, unit }));
    }
  }, [data, unit]);


  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
          <UtilityBar
            dateFilter="month"
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
          {tableProps && <DataTable { ...tableProps } />}
        </Col>
      </Row>
    </Grid>
  );
};
