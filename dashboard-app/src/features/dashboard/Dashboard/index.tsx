import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 as Heading1 } from '../../../lib/ui/components/Headings';
import { Pages } from '../../navigation/pages';
import Polaroid from '../components/Polaroid';
import { TitlesCopy } from '../copy/titles';
import { DataCard, LayoutMode } from '../components/DataCard';


const H1 = styled(Heading1)`
  margin-bottom: 3rem;
`;


/**
 * Component
 */

const testProps = {
  topText: ['Over the past ', '6 months'],
  left: {
    label: 'Most volunteer days were in',
    data: ['Sept', 'July'],
  },
  right: {
    label: 'hours each',
    data: 600,
    layoutMode: 'number' as LayoutMode,
  },
  bottomText: ['Least popular months were', 'Jan and March 2019'],
};

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
                title={TitlesCopy.Time.title}
                caption={TitlesCopy.Time.subtitle}
                callToAction="View data"
                placeHolder="T"
                onClick={() => Pages.navigateTo('Time', props.history.push)}
              >
                <DataCard {...testProps}></DataCard>
              </Polaroid>
            </Col>
            <Col xs={6}>
              <Polaroid
                title={TitlesCopy.Activities.title}
                caption={TitlesCopy.Activities.subtitle}
                callToAction="View data"
                placeHolder="A"
                onClick={() => Pages.navigateTo('Activity', props.history.push)}
              />
            </Col>
            <Col xs={6}>
              <Polaroid
                title={TitlesCopy.Volunteers.title}
                caption={TitlesCopy.Volunteers.subtitle}
                callToAction="View data"
                placeHolder="V"
                onClick={() => Pages.navigateTo('Volunteer', props.history.push)}
              />
            </Col>
            <Col xs={6}>
              <Polaroid
                title="Projects"
                caption="See what projects volunteers spend their time doing."
                callToAction="Coming soon"
                placeHolder="P"
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
