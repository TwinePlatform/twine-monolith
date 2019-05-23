import React, { useEffect, useState, useCallback, FunctionComponent } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { assoc } from 'ramda';
import { Grid, Row, Col } from 'react-flexbox-grid';

import TimeConfig from './datePickerConstraints';
import { CommunityBusinesses } from '../../api';
import _DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { displayErrors } from '../../components/ErrorParagraph';
import { H1 } from '../../components/Headings';
import { DataTableProps } from '../../components/DataTable/types';
import useRequest from '../../hooks/useRequest';
import { DurationUnitEnum } from '../../types';
import Months from '../../util/months';
import { useAggDataOnRes } from '../../hooks/useAggDataOnRes';
import { aggregatedToTableData } from '../../util/dataManipulation/aggregatedToTableData';
import { tableType } from '../../util/dataManipulation/tableType';
import { downloadCsv } from '../../util/dataManipulation/downloadCsv';


const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

const Container = styled(Grid)`
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
`;

const ByTime: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [errors, setErrors] = useState();
  const [aggData, setAggData] = useState();
  const [tableProps, setTableProps] = useState<DataTableProps | null>();

  // onload request
  const { data: logs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  // manipulate data on response
  useAggDataOnRes({
    data: { logs },
    conditions: [logs],
    updateOn: [logs, unit],
    columnHeaders: ['Activity', ...Months.range(fromDate, toDate, Months.format.verbose)],
    setErrors,
    setAggData,
    unit,
    tableType: tableType.MonthByActivity,
  });

  // manipulate data for table
  useEffect(() => {
    if (aggData) {
      setTableProps(aggregatedToTableData({
        title: 'Volunteer Activity over Months',
        sortBy: aggData.headers[0],
        data: aggData,
      }));
    }
  }, [aggData]);

  const onChangeSortBy = useCallback((column: string) => {
    setTableProps(assoc('sortBy', column, tableProps));
  }, [tableProps]);

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          <UtilityBar
            dateFilter="month"
            datePickerConstraint={TimeConfig}
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadCsv({ aggData, fromDate, toDate, setErrors, fileName: 'by_time' })} // tslint:disable-line:max-line-length
          />
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          {displayErrors(errors)}
          {
            tableProps && (
              <DataTable
                {...tableProps}
                initialOrder="asc"
                onChangeSortBy={onChangeSortBy}
                showTotals
              />
            )
          }
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ByTime);
