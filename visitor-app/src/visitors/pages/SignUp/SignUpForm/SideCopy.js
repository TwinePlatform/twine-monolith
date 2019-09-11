import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paragraph } from '../../../../shared/components/text/base';
import { FormSection } from '../../../../shared/components/form/base';
import StyledLabelledCheckbox from '../../../../shared/components/form/StyledLabelledCheckbox';
import { colors, fonts } from '../../../../shared/style_guide';


const PrivacyLink = styled.a`
  font-weight: ${fonts.weight.medium};
  color: ${colors.dark};
`;

const CenteredParagraph = styled(Paragraph)`
  line-height: 1.5em;
`;

const TitleParagraph = styled(Paragraph)`
  font-weight: medium;
  width: 100%;
  font-size: 19px;
`;

const SideCopy = props => (<FormSection flexOrder={2}>
  <TitleParagraph>Why are we collecting this information?</TitleParagraph>
  <CenteredParagraph>
  Here at {props.cbOrgName}, we take your privacy seriously: we will only use your
  personal information to administer your account to provide the products and services
  you have requested from us, and improve how we deliver those.
  </CenteredParagraph>
  <CenteredParagraph>
  However, from time to time we would like to contact you with details of other offers we
  provide. We would also like to send you surveys via SMS in order to improve our work.
  </CenteredParagraph>
  <CenteredParagraph>
  If you consent to us contacting you by email, please tick to agree:
  </CenteredParagraph>
  <StyledLabelledCheckbox name="emailContact" id="emailCheckboxInput" data-testid="emailConsent" />
  <CenteredParagraph>
  If you consent to us contacting you by SMS, please tick to agree:
  </CenteredParagraph>
  <StyledLabelledCheckbox name="smsContact" id="smsCheckboxInput" />
  <PrivacyLink href="http://www.twine-together.com/privacy-policy/">
  Data Protection Policy
  </PrivacyLink>
</FormSection>);

SideCopy.propTypes = {
  cbOrgName: PropTypes.string.isRequired,
};

export default SideCopy;
