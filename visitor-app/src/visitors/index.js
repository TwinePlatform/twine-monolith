import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/homeVisitor';
import SignUp from './pages/SignUp';
import Thanks from './pages/thanks';
import ThanksFeedback from './pages/thank_you_feedback';
import QrError from './pages/qrerror';
import SignIn from './pages/SignIn';
import ErrorPage from '../shared/pages/Error';
import redirectAfterTimeout from '../shared/components/hoc/redirect_after_timeout';


export default () => (
  <Switch>
    <Route exact path="/visitor/home" component={Home} />
    <Route path="/visitor/signup" component={SignUp} />
    <Route exact path="/visitor/login" component={SignIn} />
    <Route exact path="/visitor/qrerror" component={QrError} />
    <Route exact path="/visitor/end" component={redirectAfterTimeout('/visitor/home', 5000)(Thanks)} />
    <Route exact path="/visitor/thankyou" component={redirectAfterTimeout('/visitor/home', 5000)(ThanksFeedback)} />
    <Route render={() => <ErrorPage code={404} />} />
  </Switch>
);
