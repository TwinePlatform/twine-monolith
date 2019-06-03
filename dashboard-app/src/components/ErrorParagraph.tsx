import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { toPairs, Dictionary } from 'ramda';

import { ColoursEnum, SpacingEnum } from '../styles/design_system';


/*
 * Types
 */

interface Props {
  errors: Dictionary<string>;
}

/*
 * Styles
 */
export const ErrorParagraph = styled.p`
  min-height: 2rem;
  padding: ${SpacingEnum.small} 0;
  color: ${ColoursEnum.red};
`;


/*
 * Component
 */
const Errors: FunctionComponent<Props> = (props) =>
  (<Row center="xs">
    <Col>
      <ErrorParagraph>{toPairs(props.errors).map((x: any) => x.join(': ')) || ''}</ErrorParagraph>
    </Col>
</Row>);

export default Errors;
