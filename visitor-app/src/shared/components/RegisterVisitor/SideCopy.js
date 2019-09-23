import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paragraph, Heading2, Link } from '../text/base';
import { FormSection } from '../form/base';
import StyledLabelledCheckbox from '../form/StyledLabelledCheckbox';
import Copy from './copy.json';


const Text = styled(Paragraph)`
  line-height: 1.5em;
`;


const SideCopy = ({ cbName, forMinor }) => (
  <FormSection flexOrder={2}>
    <Heading2>Why are we collecting this information?</Heading2>
    <Text>
      {
        forMinor
          ? Copy.forMinor.explainerContent
          : Copy.forAdult.explainerContent.replace('%cbName%', cbName)
      }
    </Text>
    <Text>
      {
        forMinor
          ? Copy.forMinor.emailExplainer
          : Copy.forAdult.emailExplainer
      }
    </Text>
    <Text>
      {
        forMinor
          ? Copy.forMinor.emailPrompt
          : Copy.forAdult.emailPrompt
      }
    </Text>
    <StyledLabelledCheckbox
      id="emailCheckboxInput"
      name="isEmailConsentGranted"
      label="I consent to being contacted by email"
      data-testid="emailConsent"
    />
    <Text>
      If you would like more information please see our <Link to="http://twine-together.com/privacy-policy/">Data Protection Policy</Link>
    </Text>
  </FormSection>
);

SideCopy.propTypes = {
  cbName: PropTypes.string.isRequired,
  forMinor: PropTypes.bool,
};

SideCopy.defaultProps = {
  forMinor: false,
};

export default SideCopy;
