import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';


const inlineTopMargin = {
  marginTop: 20,
}

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  },
});

const getCopy = (eventType, newAccount, updatedAccount) => {
  switch (eventType) {
    case 'newAccount':
      return {
        description: 'New community business has been created. Please safely store the following login information. The password cannot be displayed again.',
        email: newAccount.cbAdmin.email,
        password: newAccount.cbAdmin.password
      }

    case 'updatedAccount':
      return {
        description: 'Password has been regenerated. Please store safely. The password cannot be displayed again.',
        email: updatedAccount.email,
        password: updatedAccount.password,
      }

    default:
      return {}
  }
}

const NotificationBar = (props) => {
  const { classes, newAccount, updatedAccount, eventType } = props;
  const copy = getCopy(eventType, newAccount, updatedAccount);

  return (
    <>
      <Typography component="p" style={inlineTopMargin}>{copy.description}</Typography>
      <Typography component="p" style={inlineTopMargin}>Email:</Typography>
      <SnackbarContent className={classes.snackbar} message={copy.email} />
      <Typography component="p" style={inlineTopMargin}>Password:</Typography>
      <SnackbarContent className={classes.snackbar} message={copy.password} />
    </>
  );
}

export default withStyles(styles)(NotificationBar);