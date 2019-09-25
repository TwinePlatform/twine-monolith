import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../style_guide';
import StyledLabelledCheckbox from '../form/StyledLabelledCheckbox';
import Copy from './copy.json';


const ErrorText = styled.span`
  color: ${colors.error};
  display: ${props => (props.show ? 'inline' : 'none')};
`;

const getLabel = (forMinor, cbName) =>
  forMinor
    ? Copy.forMinor.checkboxLabel.replace(/%cbName%/, cbName)
    : Copy.forAdult.checkboxLabel;

const AgeCheck = props => (
  <>
    {
      (props.forMinor || props.confirmAge) && (
        <StyledLabelledCheckbox
          id="ageCheck"
          name="ageCheck"
          label={getLabel(props.forMinor, props.cbName)}
          data-testid="ageCheck"
        />
      )
    }
    <ErrorText show={props.error}>{props.error}</ErrorText>
  </>
);

AgeCheck.propTypes = {
  forMinor: PropTypes.bool.isRequired,
  confirmAge: PropTypes.bool.isRequired,
  error: PropTypes.string,
  cbName: PropTypes.string,
};

AgeCheck.defaultProps = {
  error: '',
  cbName: '',
};

export default AgeCheck;
