import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../../../../lib/ui/design_system';
import DataCell from './DataTableCell';
import { LogsRowProps } from './types';
import { hashJSON } from '../../../../lib/util/hash';

/**
 * Styles
 */
const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${ColoursEnum.lightGrey};
  }

  &:nth-child(even) {
    background-color: ${rgba(ColoursEnum.grey, 0.2)};
  }
`;

/**
 * Component
 */
const LogsDataTableRow: React.FunctionComponent<LogsRowProps> = (props) => {
  const { columns, rowLink, order, onClick, setSelectedLog, setLogViewModalVisible, rowNumber} = props;

  const inner = (
    <TableRow data-testid="data-table-row">
      {
        order.map((h) => {return (
          <DataCell content={columns[h].content} onClick={onClick} key={hashJSON(h)}/>
          )}
        )
      }
      <button  
        className = {rowNumber%2==0?"ViewLogYellow":"ViewLog"}
        onClick={()=>{
            setLogViewModalVisible(true);
            setSelectedLog({
              ID: columns.ID.content,
              name: columns.Name.content,
              project: columns.Project.content,
              activity: columns.Activity.content,
              date: columns.Date.content,
              endTime: columns.EndTime.content,
              hours: columns.Hours.content,
              })}}>
          View log
      </button>
    </TableRow>
  );

  return rowLink
    ? <Link to={rowLink}>{inner}</Link>
    : inner;
};

export default LogsDataTableRow;
