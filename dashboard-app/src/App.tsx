import React from 'react';
import styled from 'styled-components';
import { Route, Switch, BrowserRouter, withRouter } from 'react-router-dom';

import PrivateRoute from './auth/components/PrivateRoute';
import HoldingPage from './HoldingPage';
import ByActivity from './dashboard/ByActivity/index';
import ByTime from './dashboard/ByTime/index';
import ByVolunteer from './dashboard/ByVolunteer';
import Dashboard from './dashboard/Dashboard';
import Login from './auth/pages/Login';
import ResetPassword from './auth/pages/ResetPassword';
import ForgotPassword from './auth/pages/ForgotPassword';
import ErrorPage from './Error';
import Navbar from './components/Navbar';
import { ColoursEnum, FontFamilyEnum } from './styles/style_guide';

/*
 * Styles
 */
const AppContainer = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  max-width: 1280px;
  background: ${ColoursEnum.offWhite};
  font-family: ${FontFamilyEnum.default};
`;

/*
 * Helpers
 */


const ProtectedRoutes = () => (
  <Switch>
    <Route exact path="/activity" component={ByActivity} />
    <Route exact path="/time" component={ByTime} />
    <Route exact path="/volunteer" component={ByVolunteer} />
    <Route exact path="/" component={Dashboard} />
  </Switch>
);

const AppRouter =
  withRouter((props) => (
      <>
        <Navbar pathname={props.location.pathname}/>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/password/reset/:token" component={ResetPassword} />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route exact path="/error/:code" component={ErrorPage} />
          <PrivateRoute path="/*" component={ProtectedRoutes} />
        </Switch>
      </>)
  );

/*
 * Component
 */
const App = () => (
  <AppContainer>
    {
      process.env.REACT_APP_HOLDING_PAGE
        ? <HoldingPage />
        : (<BrowserRouter><AppRouter /></BrowserRouter>)
    }
  </AppContainer>
);

export default App;
