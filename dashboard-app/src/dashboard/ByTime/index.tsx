import React, { useEffect, useState, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { displayErrors } from '../../components/ErrorParagraph';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import { DataTableProps } from '../../components/DataTable/types';
import useRequest from '../../hooks/useRequest';
import { DurationUnitEnum } from '../../types';
import { logsToTimeTable } from './helper';
import UtilityBar from '../../components/UtilityBar';
import Months from '../../util/months';


const ByTime: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [errors, setErrors] = useState();
  const [tableProps, setTableProps] = useState<DataTableProps>();

  const { data } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  useEffect(() => {
    if (data) {
      setTableProps(logsToTimeTable({ data, unit, fromDate, toDate }));
      setErrors(null);
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
          {displayErrors(errors)}
          {tableProps && <DataTable { ...tableProps } />}
        </Col>
      </Row>
    </Grid>
  );
};

export default withRouter(ByTime);
