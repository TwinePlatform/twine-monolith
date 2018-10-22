import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
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
    );
  }
}

export default withStyles(styles)(Organisations);