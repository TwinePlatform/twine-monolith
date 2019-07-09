import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Paragraph, Bold } from '../../../lib/ui/components/Typography';
import { ColoursEnum, Fonts } from '../../../lib/ui/design_system';


/*
 * Types
 */
type TileDataPoint<T> = {
  label: string
  data: T
};

export type LayoutMode = 'number' | 'text';

type TileProps = {
  topText: string []
  left: TileDataPoint<string[]>
  right: TileDataPoint<number | string[]> & { layoutMode: LayoutMode }
  bottomText: string []
};

/*
 * Styles
 */
const Grid = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 2fr 1.5fr 0.5fr 2fr;
  padding: 1rem;
`;

const TopTextContainer = styled.div`
  // background: blue;
  grid-column: span 2;
  text-align: left;
`;

const MiddleTopLeftContainer = styled.div`
  // background: pink;
  grid-area: 2 / 1 / 3 / 2;
  border-bottom: 0.5rem ${ColoursEnum.mustard} solid;
  align-self: end;
  text-align: left;
  line-height: 1.5rem;
`;

const MiddleTopRightContainer = styled.div`
  // background: purple;
  grid-area: 2 / 2 / 3 / 3;
  border-bottom: 0.5rem ${ColoursEnum.mustard} solid;
  align-self: end;
  text-align: right;
`;
const MiddleBottomRightContainer = styled.div`
  // background: purple;
  grid-area: 3 / 2 / 3 / 3;
  margin-top: 0.25rem;
  text-align: right;
`;

const BigText = styled(Paragraph)`
  font-size: ${Fonts.size.XL}
  font-weight: ${Fonts.weight.light}
`;

const BottomContainer = styled.div`
  // background: green;
  grid-area: 4 / 1 / span 1 / span 2;
  text-align: left;
  align-self: end;
  padding:
`;

const alternateBold = (xs: string[]) => (
  <Paragraph>{xs.map((x, i) => {
    return i % 2 > 0
      ? (<Bold>{x}</Bold>)
      : x;
  })}</Paragraph>
);

/*
 * Component
 */
export const DataCard: FunctionComponent<TileProps> = (props) => {

  return(
  <Grid>
    <TopTextContainer>
      {alternateBold(props.topText)}
    </TopTextContainer>
    <MiddleTopLeftContainer>
      <Paragraph>{props.left.label}</Paragraph>
      <Paragraph><Bold>{props.left.data.join(' and ')}</Bold></Paragraph>
    </MiddleTopLeftContainer>
    <MiddleTopRightContainer>
      <BigText>{props.right.data}</BigText>
    </MiddleTopRightContainer>
    <MiddleBottomRightContainer>
      <Paragraph>{props.right.label}</Paragraph>
    </MiddleBottomRightContainer>
    <BottomContainer>
      {alternateBold(props.bottomText)}
    </BottomContainer>
  </Grid>);
};

