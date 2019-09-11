/*
 * Visitor Signup Form
 *
 * Note: This component requires a UUID prop to be passed from its parent.
 * This is used to create unique field names in order to prevent browser autocomplete
 * displaying past results.
 *
 * See https://github.com/TwinePlatform/twine-visitor/issues/423
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid, Row } from 'react-flexbox-grid';
import { Form as FM, FormSection } from '../../../../shared/components/form/base';
import { Paragraph } from '../../../../shared/components/text/base';
import LabelledInput from '../../../../shared/components/form/LabelledInput';
import StyledLabelledCheckbox from '../../../../shared/components/form/StyledLabelledCheckbox';
import LabelledSelect from '../../../../shared/components/form/LabelledSelect';
import { FlexContainerRow } from '../../../../shared/components/layout/base';
import NavHeader from '../../../../shared/components/NavHeader';
import { colors } from '../../../../shared/style_guide';
import { VISITOR_NAME_INVALID } from '../../../../cb_admin/constants/error_text';
import { status } from '../../../../util';
import { SubmitButton, DisabledButton } from './buttons';
import SideCopy from './SideCopy';

/*
 * Styles
 */

const Form = styled(FM)`
  align-items: baseline;
`;

const LeftPadParagraph = styled(Paragraph)`
  padding-left: 1rem;
`;

const ErrorText = styled.span`
color: ${colors.error};
display: ${props => (props.show ? 'inline' : 'none')};
`;

const SignupForm = (props) => {
  const ageCheckCheckbox = (<FlexContainerRow>
    <StyledLabelledCheckbox name="ageCheck" id="ageCheck" data-testid="ageCheck" />
    <LeftPadParagraph>I am older than 13</LeftPadParagraph>
  </FlexContainerRow>);

  return (
    <Grid>
      <NavHeader
        leftTo="/"
        leftContent="Back to previous page"
        centerContent="Please tell us about yourself"
      />
      <Row>
        <Form onChange={props.handleChange} onSubmit={props.createVisitor}>
          <FormSection flexOrder={1}>
            <div>
              <LabelledInput
                id="visitor-signup-fullname"
                label="Full Name"
                name={`fullname$${props.uuid}`}
                type="text"
                error={props.errors.name && VISITOR_NAME_INVALID}
                required
              />
              <LabelledInput
                id="visitor-signup-email"
                label="Email Address"
                name={`email$${props.uuid}`}
                type="email"
                error={props.errors.email}
              />
              <LabelledInput
                id="visitor-signup-phonenumber"
                label="Phone Number"
                name={`phoneNumber$${props.uuid}`}
                type="text"
                error={props.errors.phoneNumber}
              />
              <LabelledInput
                id="visitor-signup-postcode"
                label="Post Code"
                name={`postCode$${props.uuid}`}
                type="text"
                error={props.errors.postCode}
                required
              />
              <LabelledSelect
                id="visitor-signup-gender"
                label="Gender"
                name="gender"
                options={props.genders}
                error={props.errors.gender}
                required
              />
              <LabelledSelect
                id="visitor-signup-birthyear"
                label="Year of Birth"
                name="year"
                options={props.years}
                error={props.errors.birthYear}
                required
              />
              {!props.hasGivenAge && ageCheckCheckbox}

              <ErrorText show={props.errors.ageCheck}>{props.errors.ageCheck}</ErrorText>
            </div>
            {props.status === status.PENDING
              ? <DisabledButton />
              : <SubmitButton />}
          </FormSection>
          <SideCopy cbOrgName={props.cbOrgName} />
        </Form>
      </Row>
    </Grid>
  )
  ;
};

SignupForm.propTypes = {
  createVisitor: PropTypes.func.isRequired,
  years: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line
  cbOrgName: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired, // See header comment
  genders: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasGivenAge: PropTypes.bool.isRequired,
  status: PropTypes.arrayOf(Object.values(status).concat(null)).isRequired,
};

export default SignupForm;
