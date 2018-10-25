import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';

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
class OrgProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organisations: null,
      error: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params
    api.organisation(id)
      .then(res => {
        this.setState({ organisation: res.data.result })
      })
      .catch((err) => {
        const errorMessage = err.response.data.error.message || 'Error fetching data.'
        this.setState({ error: errorMessage })
      })
  }

  render() {
    console.log(this.props);

    const { props: { classes }, state: { organisation, error } } = this
    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Organisation
        </Typography>
        {error && <SnackbarContent className={classes.snackbar} message={error} />}
        <Paper className={classes.container}>

        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(OrgProfile);