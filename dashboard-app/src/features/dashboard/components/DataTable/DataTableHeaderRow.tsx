import React from 'react';
import styled from 'styled-components';
import { ColoursEnum, SpacingEnum } from '../../../../lib/ui/design_system';
import { HeaderRowProps } from './types';
import { hashJSON } from '../../../../lib/util/hash';

/**
 * Styles
 */
const HeaderRow = styled.tr`
  background-color: ${ColoursEnum.grey};
`;

const HeaderCell = styled.th`
  padding-top: ${SpacingEnum.small};
  padding-bottom: ${SpacingEnum.small};
  padding-left: ${SpacingEnum.small};
  padding-right: calc(54px - ${SpacingEnum.small});
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
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
          columns.map((h, i) => (
            <HeaderCell
              scope="col"
              onClick={() => onClick(h.content)}
              title={String(h.content)}
              key={hashJSON(h)}
            >
              {sortBy === i ? `${arrow} ${h.content}` : h.content}
            </HeaderCell>
          ))
        }
      </HeaderRow>
    </thead>
  );
};

export default DataTableHeaderRow;
