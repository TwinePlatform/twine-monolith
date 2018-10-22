import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from './components/Navbar'
import AdminCodes from './pages/AdminCodes'
import Home from './pages/Home'
import Logs from './pages/Logs'
import Organisations from './pages/Organisations'


class App extends Component {
  render() {
    return (
      <Fragment>
        <Navbar/>
        <Router>
          <Fragment>
            <Route exact path="/" component={Home} />
            <Route exact path="/admin-codes" component={AdminCodes} />
            <Route exact path="/logs" component={Logs} />
            <Route exact path="/organisations" component={Organisations} />
          </Fragment>
        </Router>
      </Fragment>
    );
  }
}

export default App;
