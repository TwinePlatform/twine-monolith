import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 20,
    overflowX: 'auto',
  },
  table: {
    maxWidth: 700,
  },
});
class Organisations extends Component {
  constructor(props) {
    super(props);
    this.state = { organisations: null };
  }

  componentDidMount() {

  }

  render() {
    const classes = this.props
    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Admin Codes
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Organisation Name</TableCell>
                <TableCell numeric>Admin Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Aperture Science</TableCell>
                <TableCell numeric>10101</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Organisations);