import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// mui components
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// local components
import PasswordForgot from './pages/PasswordForgot';
import PasswordReset from './pages/PasswordReset';


const styles = (theme) => ({
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
  appBar: {
    width: '100%',
  },
});

const inlinePaperStyle = {
  margin: 20,
  marginTop: 100,
};

const Header = (props) => {
  const { classes } = props;
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Twine Platform
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const PasswordManagement = (props) => {
  const { classes } = props;

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Header {...props} />
        <Paper className={classes.content} elevation={1} style={inlinePaperStyle}>
          <div className={classes.toolbar} >
            <Route exact path="/password/forgot" component={PasswordForgot} />
            <Route exact path="/password/reset/:token" component={PasswordReset} />
          </div>
        </Paper>
      </div>
    </Router>
  );
};


export default withStyles(styles)(PasswordManagement);
