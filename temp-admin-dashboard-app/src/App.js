import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Navbar from './components/Navbar'
import AdminCodes from './pages/AdminCodes'
import Home from './pages/Home'
import Logs from './pages/Logs'
import Organisations from './pages/Organisations'

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
class App extends Component {

  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <Navbar />
          <Paper className={classes.content} elevation={1} style={inlinePaperStyle}>
            <div className={classes.toolbar} >
              <Route exact path="/" component={Home} />
              <Route exact path="/admin-codes" component={AdminCodes} />
              <Route exact path="/logs" component={Logs} />
              <Route exact path="/organisations" component={Organisations} />
            </div>
          </Paper>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
