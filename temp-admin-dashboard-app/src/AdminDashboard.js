import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
//mui components
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
//hocs
import PrivateRoute from './hoc/PrivateRoute'
//local components
import Navbar from './components/Navbar'
import AdminCodes from './pages/AdminCodes'
import Home from './pages/Home'
import Logs from './pages/Logs'
import Organisations from './pages/Organisations'
import OrgProfile from './pages/OrgProfile';
//utils
import { api } from './utils/api'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    ...theme.mixins.gutters(),
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

const inlinePaperStyle = {
  margin: 20,
  marginTop: 100,
}
class AdminDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: null,
      loginError: null,
    }
  }

  login = ({ email, password }) => {
    api.login({ email, password })
      .then(() => this.setState({ auth: true, loginError: null }))
      .catch((err) => {
        const errorMessage = (err.response.data && err.response.data.error.message) || 'There has been an error logging in.'
        this.setState({ loginError: errorMessage })
      })
  }

  render() {
    const { props: { classes }, state: { auth, loginError }, login } = this;

    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <Navbar />
          <Paper className={classes.content} elevation={1} style={inlinePaperStyle}>
            <div className={classes.toolbar} >
              <Route exact path="/" render={(props) => <Home {...props} login={login} loginError={loginError} auth={auth} />} />
              <PrivateRoute auth={auth} exact path="/admin-codes" component={AdminCodes} />
              <PrivateRoute auth={auth} exact path="/logs" component={Logs} />
              <PrivateRoute auth={auth} exact path="/organisations" component={Organisations} />
              <PrivateRoute auth={auth} exact path="/organisations/:id" component={OrgProfile} />
            </div>
          </Paper>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(AdminDashboard);
