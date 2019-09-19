import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'react-flexbox-grid';

import { CommunityBusiness, Visitors } from '../../../api';
import { redirectOnError, renameKeys } from '../../../util';
import CreateAnonUserForm from './CreateAnonUserForm';
import DisplayQrCode from '../../../shared/components/DisplayQrCode';
import NavHeader from '../../../shared/components/NavHeader';
import NotFound from '../../../shared/components/NotFound';
import { Paragraph } from '../../../shared/components/text/base';
import withRegistration from '../../../shared/components/hoc/withRegistration';


const CenteredParagraph = styled(Paragraph)`
  font-size: 1.1em;
  text-align: center;
`;

class RegisterAnonymousVisitor extends Component {

  state = {
    genders: [],
    cbOrgName: '',
    cbLogoUrl: '',
  };

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
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/cb/confirm' }));
  }

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/admin/visitors/anonymous">
          <Grid>
            <NavHeader
              leftTo="/admin"
              leftContent="Back to dashboard"
              centerContent="Create Anonymous Visitor"
            />
            <CenteredParagraph>
              This allows you to track footfall for visitors who do not want to sign up for an
              individual account. You can pick what demographic data you would like to be
              associated to this account and name it to reflect this.
            </CenteredParagraph>
            <CreateAnonUserForm
              handleChange={this.props.onChange}
              onSubmit={this.props.onSubmit}
              errors={this.props.errors}
              genders={this.state.genders}
            />
          </Grid>
        </Route>

        <Route exact path="/admin/visitors/anonymous/thankyou">
          <DisplayQrCode
            onClickPrint={this.props.onClickPrint}
            qrCode={this.props.result}
            cbLogoUrl={this.state.cbLogoUrl}
            forAdmin
          />
        </Route>

        <Route exact path="/*" component={NotFound} />
      </Switch>
    );
  }
}

RegisterAnonymousVisitor.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  result: PropTypes.string,
  onClickPrint: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.func.isRequired,
  hoist: PropTypes.func.isRequired,
};

RegisterAnonymousVisitor.defaultProps = {
  result: '',
};

const formStateToPayload = renameKeys({ year: 'birthYear' });

const registrationOpts = {
  validateForm: () => null,

  onSubmit: (form, state) => Visitors.create({
    ...formStateToPayload(form),
    organisationId: state.organisationId,
    isAnonymous: true,
  }),

  onSuccess: res => [res.data.result.qrCode, '/admin/visitors/anonymous/thankyou'],
};

export default withRegistration(registrationOpts)(RegisterAnonymousVisitor);
