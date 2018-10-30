import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

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
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

const turnoverBands = ['<£100k', '£100k-£250k', '£250k-£500k', '£500k-£750k', '£750k-£1m', '£1m-£5m', '£5m-£10m', '>£10m']

const OrgForm = ({ organisation, regions, sectors, handleChange, classes }) => {
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="name"
        label="Name"
        className={classes.textField}
        value={organisation.name}
        onChange={handleChange('name')}
        margin="normal"
      />
      <TextField
        id="360GivingId"
        label="360GivingId"
        className={classes.textField}
        value={organisation._360GivingId}
        onChange={handleChange('_360GivingId')}
        margin="normal"
      />
      <TextField
        id="address1"
        label="address1"
        className={classes.textField}
        value={organisation.address1}
        onChange={handleChange('address1')}
        margin="normal"
      />
      <TextField
        id="address2"
        label="address2"
        className={classes.textField}
        value={organisation.address1}
        onChange={handleChange('address2')}
        margin="normal"
      />
      <TextField
        id="postcode"
        label="postcode"
        className={classes.textField}
        value={organisation.address1}
        onChange={handleChange('postcode')}
        margin="normal"
      />
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="region">Region</InputLabel>
        <Select
          value={organisation.region}
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
        <InputLabel htmlFor="region">Sector</InputLabel>
        <Select
          value={organisation.sector}
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
          value={organisation.turnoverBand}
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
    </form>
  )
}

export default withStyles(styles)(OrgForm);