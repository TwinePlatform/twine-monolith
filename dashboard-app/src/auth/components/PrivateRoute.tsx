import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { FullScreenBeatLoader } from '../../components/Loaders';
import { colors } from '../../styles/style_guide';
import { Roles } from '../../api';


/**
 * Types
 */
enum AuthStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

interface PrivateRouteProps extends RouteProps {}

interface PrivateRouteState {
  authStatus: AuthStatusEnum;
}


export default class PrivateRoute extends Component<PrivateRouteProps, PrivateRouteState> {

  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  };

  state = {
    authStatus: AuthStatusEnum.PENDING,
  };

  componentDidMount () {
    Roles.get()
      .then(() => this.setState({ authStatus: AuthStatusEnum.SUCCESS }))
      .catch(() => this.setState({ authStatus: AuthStatusEnum.FAILURE }));
  }

  render () {
    const { component: Comp, ...rest } = this.props;

    switch (this.state.authStatus) {
      case AuthStatusEnum.PENDING:
        return (
          <FullScreenBeatLoader color={colors.highlight_primary} />
        );

      case AuthStatusEnum.SUCCESS:
        return (
          <Route {...rest} component={Comp} />
        );

      case AuthStatusEnum.FAILURE:
      default:
        return (
          <Redirect to={{ pathname: '/login' }} />
        );
    }

  }
}
