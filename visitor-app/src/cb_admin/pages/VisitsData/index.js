import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose } from 'ramda';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Heading3 } from '../../../shared/components/text/base';
import NavHeader from '../../../shared/components/NavHeader';
import { TabGroup } from '../../components/Tabs';
import DateRanges from './utils/dateRange';
import { ErrorUtils, Visitors, Activities } from '../../../api';
import { renameKeys, redirectOnError } from '../../../util';
import { AgeRange, Gender } from '../../../shared/constants';
import { getVisitorData, getVisitsData } from './utils/data';
import TabNumbers from './TabNumbers';
import TabDemographics from './TabDemographics';
import UtilBar from './UtilBar';
import { BasisType } from './utils/staticValues';

const BottomSpacer = styled.div`
  height: 6rem;
`;

const timeOptions = DateRanges.toSelectOptions();

export default class VisitsDataPage extends React.Component {
  state = {
    basis: BasisType.Visits,
    data: {
      gender: {},
      age: {},
      time: {},
      activity: {},
      category: {},
    },
    charts: {
      category: { stepSize: 2 },
      time: { stepSize: 2 },
    },
    options: {
      genders: [],
      activities: [],
    },
    filters: {
      gender: '',
      age: undefined,
      time: timeOptions[0].value,
      activity: '',
    },
    errors: {},
  }

  componentDidMount() {
    Promise.all([
      Visitors.genders(),
      Activities.get(),
      this.getData(),
    ])
      .then(([genderRes, activityRes]) => {
        const genderOpts = genderRes.data.result
          .map(({ name, ...rest }) => ({ ...rest, name: Gender.toDisplay(name) }))
          .map(renameKeys({ id: 'key', name: 'value' }));

        const activityOpts = activityRes.data.result
          .map(renameKeys({ id: 'key', name: 'value' }));

        this.setState(
          compose(
            assocPath(['options', 'genders'], [{ key: 0, value: 'All' }].concat(genderOpts)),
            assocPath(['options', 'activities'], [{ key: 0, value: 'All' }].concat(activityOpts)),
          ),
        );
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  onChange = (e) => {
    const path = e.target.name === 'basis'
      ? [e.target.name]
      : e.target.name.split('.');

    if (e.target.value === 'All') {
      return this.setState(assocPath(path, undefined), this.getData);
    }

    const value = this.normaliseFormValues(e.target.name, e.target.value);

    return this.setState(assocPath(path, value), this.getData);
  };

  onExportError = (error) => {
    if (ErrorUtils.errorStatusEquals(error, 401)) {
      this.props.history.push('/admin/confirm');
    } else if (ErrorUtils.errorStatusEquals(error, 500)) {
      this.props.history.push('/error/500');
    } else {
      this.setState({ errors: { general: 'Could not create CSV' } });
    }
  };

  getData = () =>
    (this.state.basis === BasisType.Visits
      ? getVisitsData(this.state.filters, this.state.charts)
      : getVisitorData(this.state.filters, this.state.charts)
    )
      .then(data => this.setState(data))
      .catch(err => redirectOnError(this.props.history.push, err))

  normaliseFormValues = (name, value) => {
    switch (name) {
      case 'filters.age':
        return value && AgeRange.fromStr(value);

      case 'filters.gender':
        return Gender.fromDisplay(value);

      default:
        return value;
    }
  }

  render() {
    const { state } = this;
    const { errors } = state;
    const { since, until } = DateRanges.toDates(this.state.filters.time);

    return (
      <Grid>
        <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Visits data"
        />
        <UtilBar
          onChange={this.onChange}
          errors={errors}
          basis={state.basis}
          filters={state.filters}
          options={state.options}
          onExportError={this.onExportError}
        />
        <Row>
          <Col>
            <Heading3>
              {moment(since).format('DD MMM YYYY')} - {moment(until).format('DD MMM YYYY')}
            </Heading3>
          </Col>
        </Row>
        <TabGroup titles={['Numbers', 'Demographics']}>
          <TabNumbers
            data={state.data}
            charts={state.charts}
            basis={state.basis}
            filterString={this.state.filters.time.toLowerCase()}
          />
          <TabDemographics data={state.data} basis={state.basis} />
        </TabGroup>
        <Row>
          <BottomSpacer />
        </Row>
      </Grid>
    );
  }
}

VisitsDataPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
