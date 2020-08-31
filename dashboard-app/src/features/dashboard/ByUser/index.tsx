import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import _LogsDataTable from '../components/DataTable/LogsDataTable';
import UsersDataTable from '../components/DataTable/UsersDataTable';
import UtilityBar from '../components/UtilityBar';
import { H1 } from '../../../lib/ui/components/Headings';
import { DataTableProps } from '../components/DataTable/types';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { aggregatedToTableData } from '../dataManipulation/aggregatedToTableDataLogs';
import { downloadCsv } from '../dataManipulation/downloadCsvLogs';
import { ColoursEnum } from '../../../lib/ui/design_system';
import Errors from '../components/Errors';
import useAggregateDataByUser from './useAggregateDataByUser';
import { useErrors } from '../../../lib/hooks/useErrorsLogs';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';
import { DashboardContext } from '../context';


/**
 * Types
 */
type TableData = Pick<DataTableProps, 'headers' | 'rows'>;



/**
 * Styles
 */
const LogsDataTable = styled(_LogsDataTable)`
  margin-top: 4rem;
`;

const Container = styled(Grid)`
`;


/**
 * Helpers
 */
const initTableData = { headers: [], rows: [] };

/**
 * Component
 */
const ByUser: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const { loading, error, data, logFields} =
    useAggregateDataByUser({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // get sorting state values
  const { orderable, onChangeOrderable } = useOrderable({
    initialOrderable: { sortByIndex: 1, order: 'desc' },
    updateOn: [tableData]
  });

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    onChangeOrderable(idx);
  }, [tableData.headers, onChangeOrderable]);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && logFields) {
      setTableData(aggregatedToTableData({ data, unit, yData: logFields }));
    }
  }, [logFields, data, loading, unit]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'activity', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [loading, data, fromDate, toDate, unit, orderable, setErrors]);

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Users.title}</H1>
        </Col>
      </Row>
      {
        loading
          ? (<FullScreenBeatLoader color={ColoursEnum.purple} />)
          : (
            <Row center="xs">
              <Col xs={12}>
                <Errors errors={errors} />
                  {
                    tableData && (
                    <div>
                        <UsersDataTable
                        {...tableData}
                        title={"Users"}
                        sortBy={tableData.headers[orderable.sortByIndex]}
                        order={orderable.order}
                        onChangeSortBy={onChangeSortBy}
                        showTotals
                      />
                    </div>
                    )
                  }
              </Col>
            </Row>
          )
      }
    </Container>
  );
};

export default withRouter(ByUser);
