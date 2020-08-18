/*
 * DataTable component
 */
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { pathOr } from 'ramda';
import { Order, sort } from 'twine-util/arrays';
import Card from '../../../../lib/ui/components/Card';
import LogsDataTableRow from './LogsDataTableRow';
import HeaderRow from './DataTableHeaderRow';
import TotalsRow from './DataTableTotalsRow';
import { LogsDataTableProps } from './types';
import { toRowProps } from './util';
import { hashJSON } from '../../../../lib/util/hash';
import { FullWidthTextBox } from '../../../../lib/ui/components/FullWidthTextBox';
import { Title } from '../Title';


/*
 * Styles
 */
const Container = styled.div`
  overflow: auto;
  max-width: calc(100vw - 7em);
`;

const Table = styled.table`
  overflow-x: scroll;
  text-align: left;
  table-layout: fixed;
  width: ${(props: { cols: number }) => props.cols * 10}rem;
`;

/*
 * Component
 */
const LogsDataTable: React.FunctionComponent<LogsDataTableProps> = (props) => {
  const headers = [
    "Name",
    "Time",
    "Project",
    "Activity",
    "Date",
    "ID",
    ];

    const {
    rows,
    sortBy = headers[0],
    order = 'desc',
    onChangeSortBy = () => { },
    title,
    showTotals = false,
    setSelectedLog,
    setLogViewModalVisible,
    ...rest
  } = props;

  const onHeaderClick = useCallback((title) => {
    onChangeSortBy(title);
  }, [onChangeSortBy]);

  const sorter = useCallback((_rows: LogsDataTableProps['rows']) =>
    sort([
      { accessor: pathOr('', ['columns', sortBy, 'content']), order },
      { accessor: pathOr('', ['columns', headers[0], 'content']), order: 'asc' as Order },
    ], _rows)
    , [sortBy, order, headers]);

  const table = (
    <Table cols={headers.length}>
      <HeaderRow
        columns={headers.map((name) => ({ content: name }))}
        order={order}
        sortBy={sortBy}
        onClick={onHeaderClick}
      />
      <tbody>
        {
          sorter(rows)
            .map((row) => (
              <LogsDataTableRow
                columns={row.columns}
                order={headers}
                key={hashJSON(row)}
                setSelectedLog={setSelectedLog}
                setLogViewModalVisible={setLogViewModalVisible}
              />
            ))
        }
        {
          showTotals && <TotalsRow rows={rows.map((r) => toRowProps(r, headers))} />
        }
      </tbody>
    </Table>
  );

  return (
    <Card {...rest}>
      {
        title && <Title title={title}></Title>
      }
      <Container>
        {
          rows.length > 0
            ? table
            : <FullWidthTextBox text="NO DATA AVAILABLE" />
        }
      </Container>
    </Card>
  );
};


export default LogsDataTable;
