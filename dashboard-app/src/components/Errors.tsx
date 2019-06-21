import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { toPairs, Dictionary } from 'ramda';

import { ColoursEnum } from '../styles/design_system';


/*
 * Types
 */
interface Props {
  errors: Dictionary<string>;
}

type ErrorParagraphProps = {
  isVisible: boolean
};

/*
 * Styles
 */
export const ErrorParagraph = styled.p<ErrorParagraphProps>`
  min-height: 2rem;
  color: ${ColoursEnum.red};
  visibility: ${({ isVisible }) => isVisible ? 'inherit' : 'hidden'};
`;


/*
 * Component
 */
const Errors: FunctionComponent<Props> = ({ errors }) => {
  const isVisible = Object.keys(errors).length >= 1;
  return (
    <Row center="xs">
      <Col>
        <ErrorParagraph isVisible={isVisible}>
          {toPairs(errors).map((x) => x.join(': ')) || ''}
        </ErrorParagraph>
      </Col>
    </Row>
  );
};

export default Errors;
