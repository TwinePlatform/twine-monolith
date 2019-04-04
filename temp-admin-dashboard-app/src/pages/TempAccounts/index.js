import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import NotificationBar from './NotificationBar';
import { api, ResponseUtils } from '../../utils/api'
import { StatusEnum } from '../../utils/enums';

const styles = theme => ({
  container: {
    width: '100%',
    marginTop: 20,
    overflowX: 'auto',
    padding: 5,
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
  snackbar: {
    margin: theme.spacing.unit,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

const inlineTopMargin = {
  marginTop: 20,
}

class CreateTempCb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: StatusEnum.PENDING,
      formUpdate: {},
      message: null,
    };
  }

  async componentDidMount() {
    await this.getTableData();
  }

  handleChange = name => event => {
    this.setState({
      formUpdate: {
        ...this.state.formUpdate,
        [name]: event.target.value
      },
    })
  };

  getTableData = async () => {
    try {
      const tempOrgRes = ResponseUtils.getRes(await api.tempOrganisations());
      const cbAdmins = await Promise.all(tempOrgRes.map((org) => api.getAdmins(org.id)))
        .then(xs => xs.map(ResponseUtils.getRes))

      const organisations = tempOrgRes.map((x, i) => ({ ...x, email: cbAdmins[i][0].email }))

      this.setState({
        organisations,
        status: StatusEnum.SUCCESS
      })
    } catch (err) {
      const errorMessage = (err.response && err.response.data.error.message) || 'Error fetching data.'
      this.setState({
        message: errorMessage,
        lastRequest: '',
      });
    }
  }

  submitForm = (e) => {
    e.preventDefault();

    const { formUpdate: { orgName } } = this.state;
    api.registerTemp({ orgName })
      .then((res) => {
        this.setState({
          newAccount: ResponseUtils.getRes(res),
          lastRequest: 'newAccount',
          message: '',
        })
      })
      .then(this.getTableData)
      .catch((err) => {
        const errorMessage = (err.response && err.response.data.error.message) || 'Error creating data.'
        this.setState({
          message: errorMessage,
          lastRequest: '',
        });
      })
  }

  regeneratePassword = (id) => {
    api.tempAdminPasswordReset(id)
      .then((res) => {
        this.setState({
          updatedAccount: ResponseUtils.getRes(res),
          lastRequest: 'updatedAccount',
          message: '',
        })
      })
      .then(this.getTableData)
      .catch((err) => {
        const errorMessage = (err.response && err.response.data.error.message) || 'Error creating data.'
        this.setState({
          message: errorMessage,
          lastRequest: '',
        })
      })
  }

  deleteAccount = (id) => {
    api.deleteTempOrganisation(id)
      .then((res) => {
        this.setState({
          message: 'Account has been deleted',
          lastRequest: 'deleteAccount',
        })
      })
      .then(this.getTableData)
      .catch((err) => {
        const errorMessage = (err.response && err.response.data.error.message) || 'Error deleting data.'
        this.setState({
          message: errorMessage,
          lastRequest: '',
        })
      })
  }

  render() {
    const {
      props: { classes },
      state: { message, newAccount, updatedAccount, lastRequest, formUpdate, organisations }, handleChange, submitForm } = this

    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Create New Temporary Account
        </Typography>
        <Paper className={classes.container}>
          <form className={classes.container} autoComplete="off" onSubmit={submitForm}>
            <TextField
              id="orgName"
              label="Organisation Name"
              className={classes.textField}
              value={formUpdate.orgName}
              onChange={handleChange('orgName')}
              margin="normal"
              required
            />
            <Button label="Submit" color="secondary" type='submit' style={{ margin: 5 }}>
              Create new temp account
            </Button>
            {message && <SnackbarContent className={classes.snackbar} message={message} />}
            {(lastRequest === 'newAccount' || lastRequest === 'updatedAccount') &&
              (<NotificationBar newAccount={newAccount} updatedAccount={updatedAccount} eventType={lastRequest} />)}
          </form>
        </Paper>
        <Typography variant="h5" component="h3" style={inlineTopMargin}>
          Exisiting Temporary Accounts
        </Typography>
        <Paper style={inlineTopMargin}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Organisation Id</TableCell>
                <TableCell>Organisation Name</TableCell>
                <TableCell>CB Admin Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Regenerate Password</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            {organisations && organisations.map(({ name, id, email, createdAt }) => (
              <TableBody>
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>{(new Date(createdAt)).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button color="secondary" className={classes.button} onClick={() => this.regeneratePassword(id)}>
                      Regenerate Password
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button color="secondary" className={classes.button} onClick={() => (window.confirm('Are you sure you wish to delete this item?')) && this.deleteAccount(id)} >
                      Delete All Data
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </Paper>
      </Fragment >
    );
  }
}

export default withStyles(styles)(CreateTempCb);
