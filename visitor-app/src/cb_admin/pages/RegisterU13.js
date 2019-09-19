import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'react-flexbox-grid';
import RegisterVisitor from '../../shared/components/RegisterVisitor';
import NavHeader from '../../shared/components/NavHeader';
import NotFound from '../../shared/components/NotFound';
import { CommunityBusiness, Visitors } from '../../api';
import { renameKeys, redirectOnError } from '../../util';
import { BirthYear } from '../../shared/constants';
import DisplayQrCode from '../../shared/components/DisplayQrCode';
import withRegistration from '../../shared/components/hoc/withRegistration';


class RegisterU13 extends Component {
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

    return (
      <Switch>
        <Route exact path="/admin/visitors/u-13">
          <Grid>
            <NavHeader
              leftTo="/admin"
              leftContent="Back to dashboard"
              centerContent="Sign Up Under 13's"
            />
            <RegisterVisitor
              handleChange={this.props.onChange}
              onSubmit={this.props.onSubmit}
              cbName={cbOrgName}
              years={BirthYear.u13OptionsList()}
              genders={genders}
              errors={this.props.errors}
              status={this.props.status}
              forMinor
            />
          </Grid>
        </Route>

        <Route path="/admin/visitors/u-13/thankyou">
          <DisplayQrCode
            cbLogoUrl={cbLogoUrl}
            qrCode={this.props.result}
            nextURL="/admin"
            onClickPrint={this.props.onClickPrint}
            forAdmin
          />
        </Route>

        <Route exact path="/*" component={NotFound} />
      </Switch>
    );
  }
}

RegisterU13.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  result: PropTypes.string,
  onClickPrint: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  hoist: PropTypes.func.isRequired,
};

RegisterU13.defaultProps = {
  result: '',
};


const formStateToPayload = renameKeys({
  fullname: 'name',
  year: 'birthYear',
});

const registrationOpts = {
  validateForm: (form) => {
    if (!form.phoneNumber && !form.email) {
      return { email: 'You must supply a phone number or email address' };
    }

    if (!form.year) {
      return { year: 'You must provide a year of birth' };
    }

    if (!form.ageCheck) {
      return { ageCheck: 'You must confirm parental consent as been given' };
    }

    return null;
  },
  onSubmit: (form, state) => Visitors.create({
    ...formStateToPayload(form),
    organisationId: state.organisationId,
  }),
  onSuccess: res => [res.data.result.qrCode, '/admin/visitors/u-13/thankyou'],
};

export default withRegistration(registrationOpts)(RegisterU13);
