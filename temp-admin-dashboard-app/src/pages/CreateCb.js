import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import { api } from '../utils/api'
import { StatusEnum } from '../utils/enums';

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

const inlinePaperStyle = {
  marginTop: 20,
}

const turnoverBands = ['<£100k', '£100k-£250k', '£250k-£500k', '£500k-£750k', '£750k-£1m', '£1m-£5m', '£5m-£10m', '>£10m']

class CreateCb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: StatusEnum.PENDING,
      formUpdate: {},
      message: null,
      regions: [],
      sectors: [],
    };
  }

  componentDidMount() {
    Promise.all([api.regions(), api.sectors()])
      .then(([regionsRes, sectorsRes]) => {
        this.setState({
          regions: regionsRes.data.result,
          sectors: sectorsRes.data.result,
          status: StatusEnum.SUCCESS
        })
      })
      .catch((err) => {
        const errorMessage = (err.response && err.response.data.error.message) || 'Error fetching data.'
        this.setState({ message: errorMessage })
      })
  }

  handleChange = name => event => {
    this.setState({
      formUpdate: {
        ...this.state.formUpdate,
        [name]: event.target.value
      },
    })
  };

  submitForm = (e) => {
    e.preventDefault();

    const { formUpdate } = this.state;

    if (!formUpdate.region || !formUpdate.sector) {
      return this.setState({ message: 'Please supply Region and Sector' })
    }

    api.register({ formUpdate })
      .then(() => {
        this.setState({
          message: 'CB has been created. An invite email has been sent to the email provided.'
        })
      })
      .catch((err) => {
        this.setState({ message: err.response.data.error.message })
      })
  }

  render() {
    const {
      props: { classes },
      state: { message, formUpdate, regions, sectors }, handleChange, submitForm } = this

    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Create New Community Business
        </Typography>
        <form className={classes.container} autoComplete="off" onSubmit={submitForm}>
          <Paper className={classes.container}>
            <TextField
              id="orgName"
              label="Organisation Name"
              className={classes.textField}
              value={formUpdate.orgName}
              onChange={handleChange('orgName')}
              margin="normal"
              required
            />
            <TextField
              id="360GivingId"
              label="360GivingId"
              className={classes.textField}
              onChange={handleChange('_360GivingId')}
              value={formUpdate._360GivingId}
              margin="normal"
            />
            <TextField
              id="address1"
              label="Address 1"
              className={classes.textField}
              value={formUpdate.address1}
              onChange={handleChange('address1')}
              margin="normal"
            />
            <TextField
              id="address2"
              label="Address 2"
              className={classes.textField}
              value={formUpdate.address2}
              onChange={handleChange('address2')}
              margin="normal"
            />
            <TextField
              id="postCode"
              label="Post Code"
              className={classes.textField}
              value={formUpdate.postCode}
              onChange={handleChange('postCode')}
              margin="normal"
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="region">Region *</InputLabel>
              <Select
                value={formUpdate.region || ''}
                onChange={handleChange('region')}
                inputProps={{
                  name: 'region',
                  id: 'region',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {regions.map(x => <MenuItem key={x.id} value={x.name}>{x.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="sector">Sector *</InputLabel>
              <Select
                value={formUpdate.sector || ''}
                className={classes.textField}
                onChange={handleChange('sector')}
                inputProps={{
                  name: 'sector',
                  id: 'sector',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {sectors.map(x => <MenuItem key={x.id} value={x.name}>{x.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="turnoverBand">Turnover Band</InputLabel>
              <Select
                value={formUpdate.turnoverBand || ''}
                className={classes.textField}
                onChange={handleChange('turnoverBand')}
                inputProps={{
                  name: 'turnoverBand',
                  id: 'turnoverBand',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {turnoverBands.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
              </Select>
            </FormControl>
            {message && <SnackbarContent className={classes.snackbar} message={message} />}
          </Paper>
          <Paper style={inlinePaperStyle}>
            <TextField
              id="adminName"
              label="Admin Name"
              className={classes.textField}
              value={formUpdate.adminName}
              onChange={handleChange('adminName')}
              margin="normal"
              required
            />
            <TextField
              id="adminEmail"
              label="Admin Email"
              className={classes.textField}
              value={formUpdate.adminEmail}
              onChange={handleChange('adminEmail')}
              margin="normal"
              required
            />
            <Button label="Submit" color="secondary" type='submit' style={{ margin: 5 }}>
              Create CB and send invite email
            </Button>
          </Paper>
        </form>
      </Fragment>
    );
  }
}

export default withStyles(styles)(CreateCb);
