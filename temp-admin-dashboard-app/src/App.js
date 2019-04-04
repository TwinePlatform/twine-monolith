import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//local components
import PasswordManagement from './PasswordManagement'
import AdminDashboard from './AdminDashboard'

const App = (props) => {

  return (
    <Router>
      <Switch>
        <Route path="/password" component={PasswordManagement} />
        <Route component={AdminDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
