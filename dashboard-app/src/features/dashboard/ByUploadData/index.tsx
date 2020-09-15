import React, { useEffect, useState, FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H1 } from '../../../lib/ui/components/Headings';
import { TitlesCopy } from '../copy/titles';
import { DashboardContext } from '../context';



const Container = styled(Grid)`
`;

/**
 * Component
 */
const ByUploadData: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);

  // set and clear errors on response
  const [error, setError] = useState("");

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Upload.title}</H1>
        </Col>
      </Row>
      
    </Container>
  );
};

export default withRouter(ByUploadData);
