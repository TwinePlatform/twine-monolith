import React from 'react';
import { Redirect } from 'react-router-dom';
import { Dictionary } from 'ramda';
import { getUrlFromStatusCode } from '../../../util/routing';
import BaseErrorBoundary from './BaseErrorBoundary';


type RedirProps = {
  redirects?: Dictionary<string>
};


class RedirectErrorBoundary extends BaseErrorBoundary<RedirProps> {
  renderError () {
    const { redirects = {} } = this.props;
    const url = getUrlFromStatusCode(this.state.statusCode, redirects);

    return (
      <Redirect to={url}/>
    );
  }
}

export default RedirectErrorBoundary;
