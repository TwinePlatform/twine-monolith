import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Response, CommunityBusinesses } from '../api';
import { redirectOnError } from '../util/routing';
import { H1, H2 } from '../components/Headings';


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
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Dashboard);
