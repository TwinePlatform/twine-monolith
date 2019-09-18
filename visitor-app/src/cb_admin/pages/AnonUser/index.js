import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from 'react-flexbox-grid';

import { CommunityBusiness, Visitors, ErrorUtils } from '../../../api';
import { redirectOnError, renameKeys } from '../../../util';
import CreateAnonUserForm from './CreateAnonUserForm';
import DisplayQrCode from '../../../shared/components/DisplayQrCode';
import NavHeader from '../../../shared/components/NavHeader';
import { Paragraph } from '../../../shared/components/text/base';


const CenteredParagraph = styled(Paragraph)`
  font-size: 1.1em;
  text-align: center;
`;

const stage = {
  ONE: 'ONE',
  TWO: 'TWO',
};

export default class AnonUser extends Component {

  state = {
    name: 'Anonymous',
    genders: [],
    errors: {},
    stage: stage.ONE,
  };

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
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/cb/confirm' }));
  }

  onSubmit = (e) => {
    e.preventDefault();

    Visitors.create({
      name: this.state.name,
      gender: this.state.gender,
      birthYear: this.state.year,
      organisationId: this.state.organisationId,
      isAnonymous: true,
    })
      .then((res) => {
        this.setState({
          stage: stage.TWO,
          qrCode: res.data.result.qrCode,
        });
      })
      .catch((err) => {
        if (ErrorUtils.errorStatusEquals(err, 400)) {
          this.setState({ errors: ErrorUtils.getValidationErrors(err) });
        } else {
          redirectOnError(this.props.history.push, err);
        }
      });
  }

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value });
  }

  render() {
    const { state } = this;

    return (
      <Grid>
        <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Create Anonymous User"
        />
        {
          state.stage === stage.ONE && (
            <>
              <CenteredParagraph>
                This allows you to track footfall for visitors who do not want to sign up for an
                individual account. You can pick what demographic data you would like to be
                associated to this account and name it to reflect this.
              </CenteredParagraph>
              <CreateAnonUserForm
                name={state.name}
                handleChange={this.handleChange}
                onSubmit={this.onSubmit}
                errors={this.state.errors}
                genders={this.state.genders}
              />
            </>
          )
        }
        {
          state.stage === stage.TWO && (
            <DisplayQrCode
              onClickPrint={() => window.print()}
              qrCode={state.qrCode}
              cbLogoUrl={state.cbLogoUrl}
              forAdmin
            />
          )
        }
      </Grid>
    );
  }
}

AnonUser.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
