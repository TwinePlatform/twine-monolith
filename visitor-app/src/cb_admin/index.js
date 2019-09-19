import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import ConfirmPassword from './pages/ConfirmPassword';
import Visitor from './pages/Visitor';
import VisitorDetails from './pages/VisitorDetails';
import VisitsData from './pages/VisitsData';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import NotFound from '../shared/components/NotFound';
import AnonUser from './pages/AnonUser';
import RegisterU13 from './pages/RegisterU13';


export default class CbAdminRoutes extends React.Component {

  state = {
    auth: true,
  }

  onLogin = () => this.setState({ auth: true })

  render() {
    return this.state.auth
      ? (<Switch>
        <Route exact path="/admin/activities" component={Activities} />
        <Route exact path="/admin/visits" component={VisitsData} />
        <Route exact path="/admin/visitors" component={VisitorDetails} />
        <Route path="/admin/visitors/anonymous" component={AnonUser} />
        <Route path="/admin/visitors/u-13" component={RegisterU13} />
        <Route exact path="/admin/visitors/:id" component={Visitor} />
        <Route exact path="/admin/settings" component={Settings} />
        <Route exact path="/admin/feedback" component={Feedback} />
        <Route exact path="/admin" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>)
      : <ConfirmPassword onLogin={this.onLogin} />;
  }
}

