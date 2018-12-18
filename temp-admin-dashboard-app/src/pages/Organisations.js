import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import OrgTable from '../components/OrgTable'
import { api } from '../utils/api'

const styles = theme => ({
  container: {
    width: '100%',
    marginTop: 20,
    overflowX: 'auto',
  },
  table: {
    maxWidth: 700,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
});
class Organisations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organisations: null,
      error: null,
    };
  }

  componentDidMount() {
    api.organisations()
      .then(res => {
        this.setState({ organisations: res.data.result })
      })
      .catch((err) => {
        const errorMessage = (err.response && err.response.data.error.message) || 'Error fetching data.'
        this.setState({ error: errorMessage })
      })
  }

  render() {
    const { props: { classes }, state: { organisations, error } } = this
    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Organisations
        </Typography>
        {error && <SnackbarContent className={classes.snackbar} message={error} />}
        <Paper className={classes.container}>
          {organisations && <OrgTable organisations={organisations} />}
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Organisations);
