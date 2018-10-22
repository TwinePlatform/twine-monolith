import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    
  },
});

const Organisations = (props) =>{
  const { classes } = props;

  return (
    <div>
        <Typography variant="h5" component="h3">
          Organisations
        </Typography>
        <Typography component="p">
          Paper can be used to build surface or other elements for your application.
        </Typography>
    </div>
  );
}

Organisations.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Organisations);