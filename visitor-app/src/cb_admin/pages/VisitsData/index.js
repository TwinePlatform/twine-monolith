import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose } from 'ramda';
import { Grid, Row, Col } from 'react-flexbox-grid';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';
import { Form as F } from '../../../shared/components/form/base';
import { Heading3 } from '../../../shared/components/text/base';
import NavHeader from '../../../shared/components/NavHeader';
import { TabGroup } from '../../components/Tabs';
import TimePeriodChart from './TimePeriodChart';
import GenderChart from './GenderChart';
import AgeGroupChart from './AgeGroupChart';
import CategoriesChart from './CategoriesChart';
import Toggle from './Toggle';
import CsvExportButton from './CsvExportButton';
import DateRanges from './dateRange';
import { ErrorUtils, Visitors, Activities } from '../../../api';
import { renameKeys, redirectOnError } from '../../../util';
import { AgeRange } from '../../../shared/constants';
import { AgeGroups } from './util';
import { getVisitorData, getVisitsData } from './data';


const Form = styled(F)`
  width: 100%;
`;

const Spacer = styled.p`
  margin: 0.4em;
`;

const ageOptions = AgeGroups.toSelectOptions();
const timeOptions = DateRanges.toSelectOptions();


export default class VisitsDataPage extends React.Component {
  state = {
    basis: 'Visits',
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
        this.setState(
          compose(
            assocPath(['options', 'genders'], [{ key: 0, value: 'All' }].concat(genderRes.data.result.map(renameKeys({ id: 'key', name: 'value' })))),
            assocPath(['options', 'activities'], [{ key: 0, value: 'All' }].concat(activityRes.data.result.map(renameKeys({ id: 'key', name: 'value' })))),
          ),
        );
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  onChange = (e) => {
    const path = e.target.name.split('.');

    if (e.target.value === 'All') {
      return this.setState(assocPath(path, undefined), this.getData);
    }

    const value = e.target.name === 'filters.age'
      ? e.target.value && AgeRange.fromStr(e.target.value)
      : e.target.value;

    return this.setState(assocPath(path, value), this.getData);
  };

  onToggleVisitsVisitors = (value) => {
    this.setState({ basis: value }, this.getData);
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
    (this.state.basis === 'Visits'
      ? getVisitsData(this.state.filters, this.state.charts)
      : getVisitorData(this.state.filters, this.state.charts)
    )
      .then(data => this.setState(data))

  render() {
    const { errors } = this.state;
    const { since, until } = DateRanges.toDates(this.state.filters.time);

    return (
      <Grid>
        <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Visits data"
        />
        <Row center="xs">
          <Form onChange={this.onChange} onSubmit={e => e.preventDefault()}>
            <Col xs={2}>
              <LabelledSelect
                id="visits-data-time-period"
                name="filters.time"
                label="Date range"
                options={timeOptions}
                errors={errors.time}
              />
            </Col>
            <Col xs={2}>
              <Spacer />
              <Toggle
                active={this.state.basis}
                left="Visits"
                right="Visitors"
                onChange={this.onToggleVisitsVisitors}
              />
            </Col>
            <Col xs={2}>
              <LabelledSelect
                id="visits-data-gender"
                name="filters.gender"
                label="By gender"
                options={this.state.options.genders}
                errors={errors.gender}
              />
            </Col>
            <Col xs={2}>
              <LabelledSelect
                id="visits-data-age"
                name="filters.age"
                label="By age group"
                options={ageOptions}
                errors={errors.age}
              />
            </Col>
            <Col xs={3}>
              <LabelledSelect
                id="visits-data-activity"
                name="filters.activity"
                label="By activity"
                options={this.state.options.activities}
                errors={errors.activity}
              />
            </Col>
            <Col xs={1}>
              <Spacer />
              <CsvExportButton
                filters={this.state.filters}
                onError={this.onExportError}
              >
                Export
              </CsvExportButton>
            </Col>
          </Form>
        </Row>
        <Row>
          <Col>
            <Heading3>
              Dates: {moment(since).format('DD MMM YYYY')} - {moment(until).format('DD MMM YYYY')}
            </Heading3>
          </Col>
        </Row>
        <TabGroup titles={['Numbers', 'Demographics']}>
          <Grid>
            <Row center="xs">
              <Col xs={8}>
                <Heading3>Reason for visiting</Heading3>
                <CategoriesChart
                  categoryData={this.state.data.category}
                  activityData={this.state.data.activity}
                  chartOptions={this.state.charts.category}
                />
              </Col>
            </Row>
            <Row center="xs">
              <Col xs={8}>
                <Heading3>{this.state.basis} over {this.state.filters.time.toLowerCase()}</Heading3>
                <TimePeriodChart data={this.state.data.time} options={this.state.charts.time} />
              </Col>
            </Row>
          </Grid>
          <Grid>
            <Row center="xs">
              <Col xs={6}>
                <Heading3>Visits by gender</Heading3>
                <GenderChart data={this.state.data.gender} />
              </Col>
              <Col xs={6}>
                <Heading3>Visits by age</Heading3>
                <AgeGroupChart data={this.state.data.age} />
              </Col>
            </Row>
          </Grid>
        </TabGroup>
        <Row>
          <Spacer />
        </Row>
      </Grid>
    );
  }
}

VisitsDataPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
