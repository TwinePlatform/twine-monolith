import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Response, CommunityBusinesses } from '../api';
import { redirectOnError } from '../util/routing';
import { H1, H2 } from '../components/Headings';
import DataTable from '../components/DataTable';


interface DashboardProps extends RouteComponentProps {}
interface DashboardState {
  organisationName: string;
}

const props = {
  headers: ['Volunteer Name', 'Total Hours Volunteered', 'Cafe/Catering', 'Committee work, AGM', 'Community Outreach and Communication', 'Help with raising funds (shop, events, ...)', 'Office support'],
  rows: [
    {
      columns: {
        'Volunteer Name': { content: 'Cindy Crawford' },
        'Total Hours Volunteered': { content: 2 },
        'Cafe/Catering': { content: 3 },
        'Committee work, AGM': { content: 4 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'Linda Evanalista' },
        'Total Hours Volunteered': { content: 2 },
        'Cafe/Catering': { content: 3 },
        'Committee work, AGM': { content: 4 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'Kate Moss' },
        'Total Hours Volunteered': { content: 2 },
        'Cafe/Catering': { content: 3 },
        'Committee work, AGM': { content: 4 },
      },
    },
  ],
};


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
            <DataTable {...props} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Dashboard);
