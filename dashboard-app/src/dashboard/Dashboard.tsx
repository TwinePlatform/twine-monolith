import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Response, CommunityBusinesses } from '../api';
import { redirectOnError } from '../util/routing';
import { H1, H2 } from '../components/Headings';
import DataTable from '../components/DataTable';
import DatePicker from '../components/DatePicker';
import "react-datepicker/dist/react-datepicker.css";

const props = {
  title: 'Data Table Title',
  headers: [
    'Volunteer Name',
    'Total Volunteer Hours',
    'Cafe/Catering',
    'Community outreach and communications',
    'Committee work, AGM',
    'Helping with raising funds (shop, events…)',
    'Office support',
    'Other',
    'Outdoor and practical work',
    'Professional pro bono work (Legal, IT, Research)',
    'Shop/Sales',
    'Support and Care for vulnerable community members',
  ],
  rows: [
    {
      columns: {
        'Volunteer Name': { content: 'foo' },
        'Total Volunteer Hours': { content: 2 },
        'Cafe/Catering': { content: 3 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        'Other': { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'bar' },
        'Total Volunteer Hours': { content: 4 },
        'Cafe/Catering': { content: 5 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        'Other': { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'baz' },
        'Total Volunteer Hours': { content: 6 },
        'Cafe/Catering': { content: 7 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        'Other': { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'bax' },
        'Total Volunteer Hours': { content: 8 },
        'Cafe/Catering': { content: 9 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        'Other': { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
  ],
};

interface DashboardProps extends RouteComponentProps {}
interface DashboardState {
  organisationName: string;
}

/**
 * Component
 */
class Dashboard extends React.Component<DashboardProps, DashboardState> {
  constructor (props: Readonly<DashboardProps>) {
    super(props);

    this.state = {
      organisationName: '',
    };
  }

  componentDidMount () {
    CommunityBusinesses.get()
      .then((res) => this.setState({ organisationName: Response.get(res, ['name']) }))
      .catch((error) => redirectOnError(this.props.history.push, error));
  }

  onDatePickerChange = (date: any) => {
    console.log(date);
  }

  render () {
    return (
      <Grid>
        <Row center="xs">
          <Col>
            <H1>{this.state.organisationName}</H1>
            <H2>Volunteer Dashboard</H2>
            <h4>There are currently no visualisations</h4>
            <div style={{ height: '20px' }}></div>
            <div>
              <DatePicker
                onChange={this.onDatePickerChange}
              />
            </div>
            <DataTable {...props} inline />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Dashboard);
