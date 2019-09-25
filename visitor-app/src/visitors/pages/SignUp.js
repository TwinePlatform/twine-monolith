import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'react-flexbox-grid';
import ErrorPage from '../../shared/pages/Error';
import RegisterVisitor from '../../shared/components/RegisterVisitor';
import NavHeader from '../../shared/components/NavHeader';
import { CommunityBusiness, Visitors } from '../../api';
import { renameKeys, redirectOnError } from '../../util';
import { BirthYear } from '../../shared/constants';
import DisplayQrCode from '../../shared/components/DisplayQrCode';
import withRegistration from '../../shared/components/hoc/withRegistration';


class Main extends Component {
  state = {
    genders: [],
    cbOrgName: '',
    cbLogoUrl: '',
  }

  componentDidMount() {

    const getCb = CommunityBusiness.get({ fields: ['name', 'logoUrl', 'id'] });
    const getGenders = Visitors.genders();

    Promise.all([getCb, getGenders])
      .then(([{ data: { result: cbRes } }, { data: { result: gendersRes } }]) => {
        this.setState({
          cbOrgName: cbRes.name,
          cbLogoUrl: cbRes.logoUrl,
          genders: [{ key: 0, value: '' }].concat(gendersRes.map(renameKeys({ id: 'key', name: 'value' }))),
        });

        this.props.hoist({ organisationId: cbRes.id });
      })
      .catch(err => redirectOnError(this.props.history.push, err));
  }

  render() {
    const { cbOrgName, genders, cbLogoUrl } = this.state;
    const { form: { year } } = this.props;
    const confirmAge = year !== BirthYear.NULL_VALUE || year === BirthYear.getBoundaryYear();

    return (
      <Switch>
        <Route exact path="/visitor/signup">
          <Grid>
            <NavHeader
              leftTo="/"
              leftContent="Back to previous page"
              centerContent="Please tell us about yourself"
            />
            <RegisterVisitor
              handleChange={this.props.onChange}
              onSubmit={this.props.onSubmit}
              cbName={cbOrgName}
              years={BirthYear.defaultOptionsList()}
              genders={genders}
              errors={this.props.errors}
              confirmAge={confirmAge}
              status={this.props.status}
            />
          </Grid>
        </Route>

        <Route path="/visitor/signup/thankyou">
          <DisplayQrCode
            cbLogoUrl={cbLogoUrl}
            qrCode={this.props.result}
            onClickPrint={this.props.onClickPrint}
            nextURL={'/visitor/home'}
          />
        </Route>

        <Route render={() => <ErrorPage code={404} />} />
      </Switch>
    );
  }
}

Main.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  result: PropTypes.string,
  onClickPrint: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  hoist: PropTypes.func.isRequired,
  form: PropTypes.shape({ year: PropTypes.any }).isRequired,
};

Main.defaultProps = {
  result: '',
};


const formStateToPayload = renameKeys({
  fullname: 'name',
  year: 'birthYear',
  emailContact: 'emailConsent',
});

const registrationOpts = {
  validateForm: (form) => {
    if (!form.phoneNumber && !form.email) {
      return { email: 'You must supply a phone number or email address' };
    }

    const age = BirthYear.toAge(BirthYear.fromDisplay(form.year));
    if (!form.ageCheck && age <= 13) {
      return { ageCheck: 'Please confirm you are at least 13 years old' };
    }

    return null;
  },
  onSubmit: (form, state) => Visitors.create({
    ...formStateToPayload(form),
    organisationId: state.organisationId,
  }),
  onSuccess: res => [res.data.result.qrCode, '/visitor/signup/thankyou'],
};

export default withRegistration(registrationOpts)(Main);
