/*
 * Visitor Signup Form
 *
 * See https://github.com/TwinePlatform/twine-visitor/issues/423
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';
import { assocPath } from 'ramda';
import { Form as FM, FormSection } from '../form/base';
import LabelledInput from '../form/LabelledInput';
import LabelledSelect from '../form/LabelledSelect';
import StyledLabelledCheckbox from '../form/StyledLabelledCheckbox';
import { VISITOR_NAME_INVALID } from '../../../cb_admin/constants/error_text';
import { status } from '../../../util';
import { SubmitButton, DisabledButton } from './buttons';
import SideCopy from './SideCopy';
import AgeCheck from './AgeCheck';


/*
 * Styles
 */

const Form = styled(FM)`
  align-items: baseline;
`;

class SignupForm extends React.Component {

  state = { uuid: '' }

  componentWillMount() {
    this.setState({ uuid: new Date().toString() });
  }

  handleChange = (e) => {
    // This is necessary because the fix for the autocomplete
    // is to simple prepend a unique string to the input name
    // See https://github.com/TwinePlatform/twine-visitor/issues/425
    const [name] = e.target.name.split('$');

    this.props.handleChange(assocPath(['target', 'name'], name, e));
  }

  render() {
    const { uuid } = this.state;
    const { onSubmit, forMinor, cbName, confirmAge, errors, genders, years } = this.props;

    return (
      <Row>
        <Form onChange={this.handleChange} onSubmit={onSubmit}>
          <FormSection flexOrder={1}>
            <div>
              <LabelledInput
                id="visitor-signup-fullname"
                label={`${forMinor ? 'Child\'s ' : ''}Full Name`}
                name={`fullname$${uuid}`}
                type="text"
                error={errors.name && VISITOR_NAME_INVALID}
                required
              />
              <LabelledInput
                id="visitor-signup-email"
                label={`${forMinor ? 'Parent/Guardian\'s ' : ''}Email Address`}
                name={`email$${uuid}`}
                type="email"
                error={errors.email}
              />
              <LabelledInput
                id="visitor-signup-phonenumber"
                label={`${forMinor ? 'Parent/Guardian\'s ' : ''}Phone Number`}
                name={`phoneNumber$${uuid}`}
                type="text"
                error={errors.phoneNumber}
              />
              <LabelledInput
                id="visitor-signup-postcode"
                label="Post Code"
                name={`postCode$${uuid}`}
                type="text"
                error={errors.postCode}
              />
              <LabelledSelect
                id="visitor-signup-gender"
                label={`${forMinor ? 'Child\'s ' : ''}Gender`}
                name="gender"
                options={genders}
                error={errors.gender}
                required
              />
              <LabelledSelect
                id="visitor-signup-birthyear"
                label={`${forMinor ? 'Child\'s ' : ''}Year of Birth`}
                name="year"
                options={years}
                error={errors.year}
                required
              />
              <AgeCheck
                forMinor={forMinor}
                confirmAge={confirmAge}
                cbName={cbName}
                error={errors.ageCheck}
              />
              <StyledLabelledCheckbox
                id="smsCheckboxInput"
                name="isSMSConsentGranted"
                label="I consent to being contacted by SMS"
                data-testid="smsConsent"
              />
            </div>
            {
              this.props.status === status.PENDING
                ? <DisabledButton />
                : <SubmitButton />
            }
          </FormSection>
          <SideCopy cbName={cbName} forMinor={forMinor} />
        </Form>
      </Row>
    );
  }
}

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  years: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line
  cbName: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  genders: PropTypes.arrayOf(PropTypes.object).isRequired,
  confirmAge: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(Object.values(status)),
  forMinor: PropTypes.bool,
};

SignupForm.defaultProps = {
  status: null,
  forMinor: false,
};

export default SignupForm;
