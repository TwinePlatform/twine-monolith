import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import OrgForm from '../components/OrgForm'

import { api } from '../utils/api'
import { StatusEnum } from '../utils/enums';

const styles = theme => ({
  container: {
    width: '100%',
    marginTop: 20,
    overflowX: 'auto',
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
});
class OrgProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: StatusEnum.PENDING,
      formUpdate: {},
      message: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params

    Promise.all([api.organisation(id), api.regions(), api.sectors()])
      .then(([orgRes, regionsRes, sectorsRes]) => {
        this.setState({
          organisation: orgRes.data.result,
          regions: regionsRes.data.result,
          sectors: sectorsRes.data.result,
          status: StatusEnum.SUCCESS
        })
      })
      .catch((err) => {
        const errorMessage = err.response.data.error.message || 'Error fetching data.'
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

  submitForm = () => {
    const { formUpdate, organisation: { id } } = this.state;
    api.updateOrganisation({ id, formUpdate })
      .then(() => {
        this.setState({ message: 'Information saved' })
        setTimeout(() => {
          this.setState({ message: null })
        }, 2000)
      })
      .catch((err) => {
        this.setState({ message: err.response.data.error.message })
      })
  }

  render() {
    const {
      props: { classes, match: { params: { id } } },
      state: { status, message }, handleChange, submitForm } = this

    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Organisation {id}
        </Typography>
        <Paper className={classes.container}>
          {status === StatusEnum.SUCCESS && <OrgForm {...this.state} submitForm={submitForm} handleChange={handleChange} />}
          {message && <SnackbarContent className={classes.snackbar} message={message} />}
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(OrgProfile);