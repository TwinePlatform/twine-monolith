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
      error: null,
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
        this.setState({ error: errorMessage })
      })
  }

  handleChange = name => event => {
    this.setState(prevState => ({
      organisation: {
        ...prevState.organisation,
        [name]: event.target.value
      },
    }));
  };

  render() {
    const {
      props: { classes, match: { params: { id } } },
      state: { status, error }, handleChange } = this

    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Organisation {id}
        </Typography>
        {error && <SnackbarContent className={classes.snackbar} message={error} />}
        <Paper className={classes.container}>
          {status === StatusEnum.SUCCESS && <OrgForm {...this.state} handleChange={handleChange} />}
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(OrgProfile);