import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

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

const OrgForm = ({ organisation, regions, sectors, handleChange, classes, submitForm, formUpdate }) => {
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="name"
        label="Name"
        className={classes.textField}
        value={formUpdate.name || organisation.name}
        onChange={handleChange('name')}
        margin="normal"
      />
      <TextField
        id="360GivingId"
        label="360GivingId"
        className={classes.textField}
        onChange={handleChange('_360GivingId')}
        value={formUpdate._360GivingId || organisation._360GivingId}
        margin="normal"
      />
      <TextField
        id="address1"
        label="address 1"
        className={classes.textField}
        value={formUpdate.address1 || organisation.address1}
        onChange={handleChange('address1')}
        margin="normal"
      />
      <TextField
        id="address2"
        label="address 2"
        className={classes.textField}
        value={formUpdate.address2 || organisation.address2}
        onChange={handleChange('address2')}
        margin="normal"
      />
      <TextField
        id="postCode"
        label="Post Code"
        className={classes.textField}
        value={formUpdate.postCode || organisation.postCode}
        onChange={handleChange('postCode')}
        margin="normal"
      />
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="region">Region</InputLabel>
        <Select
          value={formUpdate.region || organisation.region}
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
          value={formUpdate.sector || organisation.sector}
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
          value={formUpdate.turnoverBand || organisation.turnoverBand}
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
      <TextField
        id="frontlineWorkspaceId"
        label="frontlineWorkspaceId"
        className={classes.textField}
        value={organisation.frontlineWorkspaceId || 'No id linked'}
        margin="normal"
        disabled="true"
      />
      <TextField
        id="frontlineApiKey"
        label="frontlineApiKey"
        className={classes.textField}
        value={organisation.frontlineApiKey || 'No key linked'}
        margin="normal"
        disabled="true"
      />
      <Button component="span" color="secondary" onClick={() => submitForm()}>
        Save Changes
      </Button>
    </form>
  )
}

export default withStyles(styles)(OrgForm);
