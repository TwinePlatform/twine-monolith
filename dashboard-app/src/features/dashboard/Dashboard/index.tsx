import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 as Heading1 } from '../../../lib/ui/components/Headings';
import { Pages } from '../../navigation/pages';
import Polaroid from '../components/Polaroid';


const H1 = styled(Heading1)`
  margin-bottom: 3rem;
`;


/**
 * Component
 */
const Dashboard: React.FunctionComponent<RouteComponentProps> = (props) => {
  return (
    <Grid>
      <Row center="xs">
        <Col xs={6}>
          <H1>The Twine Volunteer Dashboard shows how volunteers help your organisation</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={8}>
          <Row>
            <Col xs={6}>
              <Polaroid
                title="Time"
                caption="See how much time volunteers give to you."
                callToAction="View data"
                picture="T"
                onClick={() => Pages.navigateTo('Time', props.history.push)}
              />
            </Col>
            <Col xs={6}>
              <Polaroid
                title="Activity"
                caption="See what activities volunteers spend their time doing."
                callToAction="View data"
                picture="A"
                onClick={() => Pages.navigateTo('Activity', props.history.push)}
              />
            </Col>
            <Col xs={6}>
              <Polaroid
                title="Volunteer"
                caption="See who is volunteering and how much time they give."
                callToAction="View data"
                picture="V"
                onClick={() => Pages.navigateTo('Volunteer', props.history.push)}
              />
            </Col>
            <Col xs={6}>
              <Polaroid
                title="Projects"
                caption="See what projects volunteers spend their time doing."
                callToAction="Coming soon"
                picture="P"
                disabled
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Grid>
  );
};

export default withRouter(Dashboard);
