import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';

import { ColoursEnum, GraphColoursEnum, Fonts } from '../../../../../lib/ui/design_system';
import { Span } from '../../../../../lib/ui/components/Typography';


/*
 * Types
 */

interface KeyProps {
  colour: GraphColoursEnum | ColoursEnum;
  active: boolean;
}
interface TitleProps {
  active: boolean;
}

interface Props extends KeyProps, TitleProps{
  title: string;
  onClick: any;
}

/*
 * Styles
 */
const Container = styled.div`
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const Key = styled.div<KeyProps>`
  ${(props) => props.active ? `background: ${props.colour};` : `border: solid 2px ${props.colour};`}
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 2px;
  display: inline-block;
  margin-right: 0.4rem;
  cursor: pointer;
`;

const KeyTitle = styled(Span)<TitleProps>`
  ${(props) => props.active ? '' : `color: ${ColoursEnum.grey};`}
  font-size: ${Fonts.size.footer}
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 80%;
  cursor: pointer;
  line-height: initial;
`;

/*
 * Components
 */
const LegendItem: FunctionComponent<Props> = (props) => {
  const { onClick, title, active, colour } = props;
  return (
    <Container>
      <Row start="xs" middle="xs" onClick={onClick}>
        <Key colour={colour} active={active}/>
        <KeyTitle title={title} active={active}>{title}</KeyTitle>
      </Row>
    </Container>
  );
};

export default LegendItem;

