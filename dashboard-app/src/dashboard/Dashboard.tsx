import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { CbAdmins, Response, CommunityBusinesses } from '../api';
import { redirectOnError } from '../util/routing';
import NavHeader from '../components/NavHeader/NavHeader';


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
        <NavHeader
          centerContent={
            <div style={{ textAlign: 'center' }}>
              <h1>{this.state.organisationName}</h1>
              <h2>Volunteer Dashboard</h2>
            </div>
          }
          rightContent="Logout"
          rightTo="/login"
          rightOnClick={CbAdmins.logout}
        />
        <Row center="xs">
          <Col>
            <h4>There are currently no visualisations</h4>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withRouter(Dashboard);
