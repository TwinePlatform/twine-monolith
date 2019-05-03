import React, { useEffect, useState } from 'react';
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
  // only get logs from last year
  const { error, loading, data } = useRequest({ apiCall: CommunityBusinesses.getLogs });
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [months, setMonths] = useState(DateRange.months);
  const [tableProps, setTableProps] = useState<DataTableProps>();

  useEffect(() => {
    if (data) {
      setTableProps(timeLogsToTable({ data, months, unit }));
    }
  }, [data, unit]);

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
          <UtilityBar dateFilter="month" onUnitChange={setUnit}/>
          {tableProps && <DataTable { ...tableProps } />}
        </Col>
      </Row>
    </Grid>
  );
};
