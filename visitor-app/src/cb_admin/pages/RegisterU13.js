import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'react-flexbox-grid';
import { assocPath } from 'ramda';
import { RegisterMinorVisitor } from '../../shared/components/RegisterVisitor';
import NavHeader from '../../shared/components/NavHeader';
import NotFound from '../../shared/components/NotFound';
import { CommunityBusiness, Visitors, ErrorUtils } from '../../api';
import { renameKeys, redirectOnError, status } from '../../util';
import { BirthYear } from '../../shared/constants';
import DisplayQrCode from '../../shared/components/DisplayQrCode';


const formStateToPayload = renameKeys({
  fullname: 'name',
  year: 'birthYear',
  emailContact: 'emailConsent',
});


export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      genders: [],
      qrCode: '',
      errors: {},
      form: {},
      isPrinting: false,
      cbOrgName: '',
      organisationId: null,
      cbLogoUrl: '',
      ageCheck: false,
      // form validation for age
      signUpStatus: null,
    };
  }

  componentDidMount() {

    const getCb = CommunityBusiness.get({ fields: ['name', 'logoUrl', 'id'] });
    const getGenders = Visitors.genders();

    Promise.all([getCb, getGenders])
      .then(([{ data: { result: cbRes } }, { data: { result: gendersRes } }]) =>
        this.setState({
          cbOrgName: cbRes.name,
          cbLogoUrl: cbRes.logoUrl,
          organisationId: cbRes.id,
          genders: [{ key: 0, value: '' }].concat(gendersRes.map(renameKeys({ id: 'key', name: 'value' }))),
        }))
      .catch(err => redirectOnError(this.props.history.push, err));
  }

  onClickPrint = () => {
    window.print();
  }

  handleChange = (e) => {
    switch (e.target.type) {
      case 'checkbox':
        return this.setState(assocPath(['form', e.target.name], e.target.checked));
      default:
        return this.setState(assocPath(['form', e.target.name], e.target.value));
    }
  }

  validateForm = () => {
    if (!this.state.phoneNumber && !this.state.email) {
      return { errors: { email: 'You must supply a phone number or email address' } };
    }

    if (!this.state.year) {
      return { errors: { year: 'You must provide a year of birth' } };
    }

    if (!this.state.ageCheck) {
      return { errors: { ageCheck: 'You must confirm parental consent as been given' } };
    }

    return null;
  }

  createVisitor = (e) => {
    e.preventDefault();

    const validationErrors = this.validateForm();
    if (validationErrors) {
      return this.setState(validationErrors);
    }

    this.setState({ signUpStatus: status.PENDING });

    return Visitors.create({
      ...formStateToPayload(this.state.form),
      organisationId: this.state.organisationId,
    })
      .then((res) => {
        this.setState({ qrCode: res.data.result.qrCode });
        this.props.history.push('/visitor/signup/thankyou');
      })
      .catch((err) => {
        if (ErrorUtils.errorStatusEquals(err, 400)) {
          this.setState({
            signUpStatus: status.FAILURE,
            errors: ErrorUtils.getValidationErrors(err),
          });
        } else if (ErrorUtils.errorStatusEquals(err, 409)) {
          this.setState({
            signUpStatus: status.FAILURE,
            errors: { email: ErrorUtils.getErrorMessage(err) },
          });
        } else {
          redirectOnError(this.props.history.push, err);
        }
      });
  };

  render() {
    const { errors, cbOrgName, genders, cbLogoUrl, qrCode } = this.state;

    return (
      <div className="row">
        <Switch>
          <Route exact path="/admin/visitors/u-13">
            <Grid>
              <NavHeader
                leftTo="/admin"
                leftContent="Back to dashboard"
                centerContent="Sign Up Under 13's"
              />
              <RegisterMinorVisitor
                handleChange={this.handleChange}
                onSubmit={this.createVisitor}
                cbName={cbOrgName}
                years={BirthYear.u13OptionsList()}
                genders={genders}
                errors={errors}
                status={this.state.signUpStatus}
              />
            </Grid>
          </Route>

          <Route path="/admin/visitors/u-13/thankyou">
            <DisplayQrCode
              cbLogoUrl={cbLogoUrl}
              qrCode={qrCode}
              nextURL="/admin"
              onClickPrint={this.onClickPrint}
            />
          </Route>

          <Route exact path="/*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

Main.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
