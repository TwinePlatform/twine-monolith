import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row as _Row, Col, Grid } from 'react-flexbox-grid';

import { ColoursEnum, GraphColoursEnum } from '../../../styles/design_system';
import { Paragraph } from '../../Typography';
import { AccessibilityButton as Button } from '../../Buttons';


/*
 * Types
 */

interface KeyProps {
  colour: GraphColoursEnum;
  active: boolean;
}
interface TitleProps {
  active: boolean;
}

interface Props extends KeyProps, TitleProps{
  title: string;
  setActivityOfDatum: any;
}

/*
 * Styles
 */


const Row = styled(_Row)`
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

`;

const Key = styled.div<KeyProps>`
  ${(props) => props.active ? `background:${props.colour}` : `border: solid 2px ${props.colour}`}
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 2px;
`;

const KeyTitle = styled(Paragraph)<TitleProps>`
  text-align: left;
  ${(props) => props.active ? '' : `color: ${ColoursEnum.grey}`}
`;
/*
 * Components
 */


const LegendItem: FunctionComponent<Props> = (props) => {
  const { setActivityOfDatum, title, active } = props;
  return (
  <Button onClick={() => setActivityOfDatum(title)}>
    <Grid>
      <Row middle="xs">
          <Col xs={2}>
            <Key colour={props.colour} active={props.active}/> {/*TD*/}
          </Col>
          <Col xs={10}>
            <KeyTitle active={active}>{title}</KeyTitle> {/*TD*/}
          </Col>
      </Row>
    </Grid>
  </Button>

  );
};

export default LegendItem;

