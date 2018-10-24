import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { api } from '../utils/api'

const styles = theme => ({
  root: {
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
class AdminCodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organisations: null,
      error: null,
    };
  }

  componentDidMount() {
    api.adminCodes()
      .then(res => {
        this.setState({ organisations: res.data.result })
      })
      .catch((err) => {
        const errorMessage = err.response.data.error.message || 'Error fetching data.'
        this.setState({ error: errorMessage })
      })
  }

  render() {
    const { props: { classes }, state: { organisations, error } } = this
    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Admin Codes
        </Typography>
        {error && <SnackbarContent className={classes.snackbar} message={error} />}
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Organisation Name</TableCell>
                <TableCell numeric>Admin Code</TableCell>
              </TableRow>
            </TableHead>
            {organisations && organisations.map(({ name, adminCode }) => (
              <TableBody>
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{adminCode}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AdminCodes);