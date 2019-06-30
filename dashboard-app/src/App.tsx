import React, { createContext, useState } from 'react';
import styled from 'styled-components';
import { Route, Switch, BrowserRouter, withRouter } from 'react-router-dom';

import PrivateRoute from './features/auth/components/PrivateRoute';
import HoldingPage from './features/HoldingPage';
import ByActivity from './features/dashboard/ByActivity/index';
import ByTime from './features/dashboard/ByTime/index';
import ByVolunteer from './features/dashboard/ByVolunteer/index';
import Dashboard from './features/dashboard/Dashboard';
import Login from './features/auth/pages/Login';
import ResetPassword from './features/auth/pages/ResetPassword';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import FAQPage from './features/faqs';
import ErrorPage from './features/Error';
import Navbar from './features/navigation/Navbar';
import Footer from './lib/ui/components/Footer';
import { ColoursEnum, Fonts } from './lib/ui/design_system';
import { DurationUnitEnum } from './types';

/*
 * Styles
 */
const AppContainer = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  max-width: 1280px;
  background: ${ColoursEnum.lightGrey};
  font-family: ${Fonts.family.main};
`;

const Content = styled.div`
  min-height: calc(100vh - 4.8125rem - 6rem - 13rem);
`;


/*
 * Context
 */
export const DashboardContext = createContext<any>(null);

/*
 * Helpers
 */


const ProtectedRoutes = () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  return(
    <DashboardContext.Provider value={{ unit, setUnit }}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/activity" component={ByActivity} />
        <Route exact path="/time" component={ByTime} />
        <Route exact path="/volunteer" component={ByVolunteer} />
        <Route exact path="/faqs" component={FAQPage} />
      </Switch>
    </DashboardContext.Provider>
  );
};


const AppRouter =
  withRouter((props) => (
      <>
        <Navbar pathname={props.location.pathname}/>
        <Content>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/password/reset/:token" component={ResetPassword} />
            <Route exact path="/password/forgot" component={ForgotPassword} />
            <Route exact path="/error/:code" component={ErrorPage} />
            <PrivateRoute path="/*" component={ProtectedRoutes} />
          </Switch>
        </Content>
        <Footer />
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
