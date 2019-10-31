import React from 'react';
import { Route, Switch } from 'react-router-dom';

import OuterContainer from './shared/components/OuterContainer';
import Container from './shared/components/Container';
import HomePage from './shared/pages/Home';
import ErrorPage from './shared/pages/Error';

import VisitorRoutes from './visitors';
import CbAdminRoutes from './cb_admin';
import Login from './cb_admin/pages/Login';
import PrivateRoute from './auth/PrivateRoute';
import ResetPassword from './cb_admin/pages/ResetPassword';
import ForgotPassword from './cb_admin/pages/ForgotPassword';
import ConfirmRole from './confirm_role/pages/ConfirmRole';


const ProtectedRoutes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/visitor/*" component={VisitorRoutes} />
    <Route path="/admin" component={CbAdminRoutes} />

    <Route exact path="/error/:code" component={ErrorPage} />
    <Route render={() => <ErrorPage code={404} />} />
  </Switch>
);

const App = () => (
  <OuterContainer>
    <Container>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/confirm-role/:token" component={ConfirmRole} />
        <PrivateRoute path="/*" component={ProtectedRoutes} />
      </Switch>
    </Container>
  </OuterContainer>
);

export default App;
