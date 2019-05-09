import React, { useState, useEffect } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { FullScreenBeatLoader } from '../../components/Loaders';
import { ColoursEnum } from '../../styles/design_system';
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


/**
 * Component
 */
const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const { component: Comp, ...rest } = props;
  const [authStatus, setAuthStatus] = useState(AuthStatusEnum.PENDING);

  useEffect(() => {
    Roles.get()
      .then(() => setAuthStatus(AuthStatusEnum.SUCCESS))
      .catch(() => setAuthStatus(AuthStatusEnum.FAILURE));
  });

  switch (authStatus) {
    case AuthStatusEnum.PENDING:
      return (
        <FullScreenBeatLoader color={ColoursEnum.purple} />
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
};

export default PrivateRoute;
