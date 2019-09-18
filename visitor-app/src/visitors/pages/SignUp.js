import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'react-flexbox-grid';
import { assocPath } from 'ramda';
import { RegisterAdultVisitor } from '../../shared/components/RegisterVisitor';
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
      form: {},
      errors: {},
      isPrinting: false,
      cbOrgName: '',
      organisationId: null,
      cbLogoUrl: '',
      // form validation for age
      hasGivenAge: true, // defaults to true to avoid showing age checkbox on load
      ageCheck: false,
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

  onChange = (e) => {
    if (e.target.name === 'year') {
      this.setState({ hasGivenAge: e.target.value !== BirthYear.NULL_VALUE });
    }

    switch (e.target.type) {
      case 'checkbox':
        return this.setState(assocPath(['form', e.target.name], e.target.checked));
      default:
        return this.setState(assocPath(['form', e.target.name], e.target.value));
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = this.validateForm();
    if (validationErrors) {
      return this.setState(validationErrors);
    }

    this.setState({ signUpStatus: status.PENDING });

    try {
      const qrCode = await this.createVisitor();
      this.setState({ qrCode }, () => this.props.history.push('/visitor/signup/thankyou'));

    } catch (err) {
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
    }

    return null;
  }

  validateForm = () => {
    if (!this.state.phoneNumber && !this.state.email) {
      return { errors: { email: 'You must supply a phone number or email address' } };
    }

    if (!this.state.ageCheck) {
      return { errors: { ageCheck: 'You must be over 13 to register' } };
    }

    return null;
  }

  createVisitor = async () => {
    const res = await Visitors.create({
      ...formStateToPayload(this.state.form),
      organisationId: this.state.organisationId,
    });

    return res.data.result.qrCode;
  }

  render() {
    const { errors, cbOrgName, genders, cbLogoUrl, qrCode } = this.state;

    return (
      <Switch>
        <Route exact path="/visitor/signup">
          <Grid>
            <NavHeader
              leftTo="/"
              leftContent="Back to previous page"
              centerContent="Please tell us about yourself"
            />
            <RegisterAdultVisitor
              handleChange={this.onChange}
              onSubmit={this.createVisitor}
              cbName={cbOrgName}
              years={BirthYear.defaultOptionsList()}
              genders={genders}
              errors={errors}
              hasGivenAge={this.state.hasGivenAge}
              status={this.state.signUpStatus}
            />
          </Grid>
        </Route>

        <Route path="/visitor/signup/thankyou">
          <DisplayQrCode
            cbLogoUrl={cbLogoUrl}
            qrCode={qrCode}
            onClickPrint={this.onClickPrint}
            nextURL={'/visitor/home'}
          />
        </Route>

        <Route exact path="/*" component={NotFound} />
      </Switch>
    );
  }
}

Main.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
