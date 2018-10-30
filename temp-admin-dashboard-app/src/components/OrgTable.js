import React from 'react';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    width: '100%',
    marginTop: 20,
    overflowX: 'auto',
  },
  table: {
    maxWidth: 700,
  },
  button: {
    margin: theme.spacing.unit,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
});

const OrgTable = (props) => {
  const { classes, organisations } = props;
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Organisation Name</TableCell>
          <TableCell numeric>Region</TableCell>
          <TableCell numeric>Sector</TableCell>
          <TableCell numeric>360GivingId</TableCell>
          <TableCell numeric>Turnover Band</TableCell>
          <TableCell numeric>Created</TableCell>
          <TableCell numeric>Edit</TableCell>
        </TableRow>
      </TableHead>
      {organisations && organisations.map(({ id, name, region, sector, _360GivingId, turnoverBand, createdAt }) => (
        <TableBody>
          <TableRow key={name}>
            <TableCell>{id}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{region}</TableCell>
            <TableCell>{sector}</TableCell>
            <TableCell>{_360GivingId}</TableCell>
            <TableCell>{turnoverBand}</TableCell>
            <TableCell>{(new Date(createdAt)).toLocaleDateString()}</TableCell>
            <TableCell>
              <Link to={`/organisations/${id}`}>
                <Button color="secondary" className={classes.button}>
                  Edit
              </Button>
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      ))}
    </Table>
  );
}


export default withStyles(styles)(OrgTable);