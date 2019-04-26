import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Response, CommunityBusinesses } from '../api';
import { redirectOnError } from '../util/routing';
import { H1, H2 } from '../components/Headings';
import DataTable from '../components/DataTable';

const props = {
    title: 'Data Table Title',
    headers: [
      'Volunteer Name',
      'Total Hours Volunteered',
      'Cafe/Catering',
      'Committee work, AGM',
      'Community Outreach and Comms',
      'Help with raising funds (shop, events...)',
      'Office support',
      'Other',
      'Outdoor and practical work',
      'Professional pro-bono work (Legal, IT, Research)',
      'Shop/Sales',
      'Support and care for vulnerable community members',
    ],
    initialSortColumn: 'Volunteer Name',
    rows: [
      {
        columns: {
          'Volunteer Name': { content: 'foo' },
          'Total Hours Volunteered': { content: 2 },
          'Cafe/Catering': { content: 3 },
          'Committee work, AGM': { content: 3 },
          'Community Outreach and Comms': { content: 3 },
          'Help with raising funds (shop, events...)': { content: 3 },
          'Office support': { content: 3 },
          'Other': { content: 3 },
          'Outdoor and practical work': { content: 3 },
          'Professional pro-bono work (Legal, IT, Research)': { content: 3 },
          'Shop/Sales': { content: 3 },
          'Support and care for vulnerable community members': { content: 3 },
        },
      },
      {
        columns: {
          'Volunteer Name': { content: 'bar' },
          'Total Hours Volunteered': { content: 4 },
          'Cafe/Catering': { content: 5 },
          'Committee work, AGM': { content: 3 },
          'Community Outreach and Comms': { content: 3 },
          'Help with raising funds (shop, events...)': { content: 3 },
          'Office support': { content: 3 },
          'Other': { content: 3 },
          'Outdoor and practical work': { content: 3 },
          'Professional pro-bono work (Legal, IT, Research)': { content: 3 },
          'Shop/Sales': { content: 3 },
          'Support and care for vulnerable community members': { content: 3 },
        },
      },
      {
        columns: {
          'Volunteer Name': { content: 'baz' },
          'Total Hours Volunteered': { content: 6 },
          'Cafe/Catering': { content: 7 },
          'Committee work, AGM': { content: 3 },
          'Community Outreach and Comms': { content: 3 },
          'Help with raising funds (shop, events...)': { content: 3 },
          'Office support': { content: 3 },
          'Other': { content: 3 },
          'Outdoor and practical work': { content: 3 },
          'Professional pro-bono work (Legal, IT, Research)': { content: 3 },
          'Shop/Sales': { content: 3 },
          'Support and care for vulnerable community members': { content: 3 },
        },
      },
      {
        columns: {
          'Volunteer Name': { content: 'bax' },
          'Total Hours Volunteered': { content: 8 },
          'Cafe/Catering': { content: 9 },
          'Committee work, AGM': { content: 3 },
          'Community Outreach and Comms': { content: 3 },
          'Help with raising funds (shop, events...)': { content: 3 },
          'Office support': { content: 3 },
          'Other': { content: 3 },
          'Outdoor and practical work': { content: 3 },
          'Professional pro-bono work (Legal, IT, Research)': { content: 3 },
          'Shop/Sales': { content: 3 },
          'Support and care for vulnerable community members': { content: 3 },
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

  render () {
    return (
      <Grid>
        <Row center="xs">
          <Col>
            <H1>{this.state.organisationName}</H1>
            <H2>Volunteer Dashboard</H2>
            <h4>There are currently no visualisations</h4>
            <div style={{ height: '20px' }}></div>
            <DataTable {...props}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Dashboard);
