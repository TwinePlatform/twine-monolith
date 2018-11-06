import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as csv from 'fast-csv'
import saveAs from 'file-saver';
import * as moment from 'moment'

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { api } from '../utils/api';

const today = moment().format('YYYY-MM-DD');

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
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
  button: {
    margin: theme.spacing.unit,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
});
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    }
  };

  getVisitLogs = () => {
    api.visitLogs()
      .then((res) => {
        const logs = res.data.result
        const headers = Object.keys(logs[0]).reduce((acc, el) => ({ ...acc, ...{ [el]: el } }), { date: 'date', time: 'time' })

        const csvData = [headers].concat(logs.map(x => (
          {
            ...x,
            ...{
              date: moment(x.createdAt).format('DD-MM-YY'),
              time: moment(x.createdAt).format('HH:MM')
            }
          })))
        csv.writeToString(csvData, (err, csvString) => {
          var file = new File([csvString], `${today}_visit_logs.csv`, { type: "text/csv" });
          saveAs(file)
        })
      })
      .catch((err) => {
        const errorMessage = err.response.data.error.message || 'Error fetching data.'
        this.setState({ message: errorMessage })
      })
  }

  getVolunteerLogs = () => {
    api.volunteerLogs()
      .then((res) => {
        const logs = res.data.result.map(log => {
          const hours = log.duration.hours ? `${log.duration.hours} hours, ` : '';
          const minutes = log.duration.minutes ? `${log.duration.minutes} minutes, ` : ''
          const seconds = log.duration.seconds ? `${log.duration.seconds} seconds` : ''
          return {
            ...log,
            duration: `${hours}${minutes}${seconds}`,
          }
        })
        const headers = Object.keys(logs[0]).reduce((acc, el) => ({ ...acc, ...{ [el]: el } }), { date: 'date', time: 'time' })

        const csvData = [headers].concat(logs.map(x => (
          {
            ...x,
            ...{
              date: moment(x.createdAt).format('DD-MM-YY'),
              time: moment(x.createdAt).format('HH:MM')
            }
          })))

        csv.writeToString(csvData, (err, csvString) => {
          var file = new File([csvString], `${today}_volunteer_logs.csv`, { type: "text/csv" });
          saveAs(file)
        })
      })
      .catch((err) => {
        const errorMessage = err.response.data.error.message || 'Error fetching data.'
        this.setState({ message: errorMessage })
      })
  }

  render() {
    const { props: { classes }, getVisitLogs, getVolunteerLogs, state: { message } } = this;
    return (
      <Fragment>
        <Typography variant="h5" component="h3">
          Logs
        </Typography>
        <Button component="span" color="secondary" onClick={() => getVisitLogs()}>
          Download Visitor Logs
        </Button>
        <Button component="span" color="secondary" onClick={() => getVolunteerLogs()}>
          Download Volunteer Logs
        </Button>
        {message && <SnackbarContent className={classes.snackbar} message={message} />}
      </Fragment>
    )
  }
};

export default withStyles(styles)(Home)