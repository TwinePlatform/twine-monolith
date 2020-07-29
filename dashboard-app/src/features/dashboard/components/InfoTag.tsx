import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';
import { Span as _Span } from '../../../lib/ui/components/Typography';


const Span = styled(_Span)`
  margin-right: 1rem;
  cursor: pointer;
`;


const Info: FunctionComponent<{ title: string }> = ({ title }) => {
  return (
    <Tooltip>
      <Span role="img" aria-label="information" data-tooltip={title}>ⓘ</Span>
    </Tooltip>
  )
}

export default Info;
