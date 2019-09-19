import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paragraph, Heading2, Link } from '../text/base';
import { FormSection } from '../form/base';
import StyledLabelledCheckbox from '../form/StyledLabelledCheckbox';


const Text = styled(Paragraph)`
  line-height: 1.5em;
`;


const SideCopy = props => (
  <FormSection flexOrder={2}>
    <Heading2>Why are we collecting this information?</Heading2>
    <Text>
      Here at {props.cbName}, we take your privacy seriously: we will only use your
      personal information to administer your account to provide the products and services
      you have requested from us, and improve how we deliver those.
    </Text>
    <Text>
      However, from time to time we would like to contact you with details of other offers we
      provide.
    </Text>
    <Text>
      If you consent to us contacting you by email, please tick to agree:
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
};

export default SideCopy;
