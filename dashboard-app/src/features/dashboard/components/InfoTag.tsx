import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Span as _Span } from '../../../lib/ui/components/Typography';


const Span = styled(_Span)`
  margin-right: 1rem;
`;


const Info: FunctionComponent<{ title: string }> = ({ title }) => {
  return (
    <Span role="img" aria-label="information" title={title}>ⓘ</Span>
  )
}

export default Info;
