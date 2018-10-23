import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
});
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { props: { classes, login, loginError, auth }, state: { email, password } } = this;

    const loginForm = <form noValidate autoComplete="off">
      <TextField
        id="email"
        label="Email"
        className={classes.textField}
        value={this.state.email}
        onChange={this.handleChange('email')}
        margin="normal"
      />
      <TextField
        id="password"
        label="Password"
        value={this.state.password}
        onChange={this.handleChange('password')}
        className={classes.textField}
        margin="normal"
        type="password"
      />
      <Button component="span" onClick={() => login({ email, password })}>
        Login
  </Button>
      {loginError && <SnackbarContent className={classes.snackbar} message={loginError} />}
    </form>

    return (
      <Typography variant="h5" component="h3">
        Home
      {!auth ? loginForm : <Typography component="p">You are logged in</Typography>
        }

      </Typography>
    )
  }
};

export default withStyles(styles)(Home)