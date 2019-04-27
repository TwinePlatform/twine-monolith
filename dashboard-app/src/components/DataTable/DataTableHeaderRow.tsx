import React from 'react';
import styled from 'styled-components';
import { ColoursEnum, SpacingEnum } from '../../styles/style_guide';
import { HeaderRowProps } from './types';


/**
 * Styles
 */
const HeaderRow = styled.tr`
  background-color: ${ColoursEnum.light};
`;

const HeaderCell = styled.th`
  padding: ${SpacingEnum.small} 27px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
`;


/**
 * Component
 */
const DataTableHeaderRow: React.FunctionComponent<HeaderRowProps> = (props) => {
  const { columns, order, sortBy, onClick = () => {} } = props;
  const arrow = order === 'desc' ? '↓' : '↑';

  return (
    <thead>
      <HeaderRow>
        {
          columns.map((h) => (
            <HeaderCell scope="col" onClick={() => onClick(h.content)} title={String(h.content)}>
              {sortBy === h.content ? `${arrow} ${h.content}` : h.content}
            </HeaderCell>
          ))
        }
      </HeaderRow>
    </thead>
  );
};

export default DataTableHeaderRow;
