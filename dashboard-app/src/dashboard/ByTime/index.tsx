import React, { useEffect, useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import { DataTableProps } from '../../components/DataTable/types';
import useRequest from '../../util/hooks/useRequest';
import { DurationUnitEnum } from '../../types';
import { logsToTimeTable } from './helper';
import UtilityBar from '../../components/UtilityBar';
import Months from '../../util/months';

export default () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [tableProps, setTableProps] = useState<DataTableProps>();

  const { data } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
  });

  useEffect(() => {
    if (data) {
      setTableProps(logsToTimeTable({ data, unit, fromDate, toDate }));
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
