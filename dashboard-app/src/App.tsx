import React from 'react';
import styled from 'styled-components';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './auth/components/PrivateRoute';
import HoldingPage from './HoldingPage';
import Dashboard from './dashboard/Dashboard';
import Login from './auth/pages/Login';
import ResetPassword from './auth/pages/ResetPassword';
import ForgotPassword from './auth/pages/ForgotPassword';
import ErrorPage from './Error';
import { fonts, ColoursEnum } from './styles/style_guide';


const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 1280px;
  background: ${ColoursEnum.offWhite};
  font-family: ${fonts.family.default};
`;

const ProtectedRoutes = () => (
  <Switch>
    <Route exact path="/" component={Dashboard} />
  </Switch>
);

const App = () => (
    <AppContainer>
      {
        process.env.REACT_APP_HOLDING_PAGE
          ? <HoldingPage />
          : (
            <BrowserRouter>
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/password/reset/:token" component={ResetPassword} />
                <Route exact path="/password/forgot" component={ForgotPassword} />
                <Route exact path="/error/:code" component={ErrorPage} />
                <PrivateRoute path="/*" component={ProtectedRoutes} />
              </Switch>
            </BrowserRouter>
          )
      }
    </AppContainer>
);

export default App;
