import React, { useEffect, useState, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';
import { displayErrors } from '../../components/ErrorParagraph';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 as _H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import _DataTable from '../../components/DataTable';
import { DataTableProps } from '../../components/DataTable/types';
import useRequest from '../../hooks/useRequest';
import { DurationUnitEnum } from '../../types';
import { logsToTimeTable } from './helper';
import UtilityBar from '../../components/UtilityBar';
import Months from '../../util/months';

const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

const H1 = styled(_H1)`
  margin-top: 6rem;
`;

const Uti = styled(UtilityBar)`
  margin-top: 4rem;
`;

const ByTime: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [errors, setErrors] = useState();
  const [tableProps, setTableProps] = useState<DataTableProps | null>();

  const { data } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  useEffect(() => {
    if (data) {
      setErrors(null);
      setTableProps(logsToTimeTable({ data, unit, fromDate, toDate, setErrors }));
    }
  }, [data, unit]);

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={8}>
          <Uti
            dateFilter="month"
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={8}>
          {displayErrors(errors)}
          {tableProps && <DataTable { ...tableProps } initialOrder="desc" />}
        </Col>
      </Row>
    </Grid>
  );
};

export default withRouter(ByTime);
