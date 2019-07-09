import React from 'react';
import styled from 'styled-components';
import { Paragraph, Bold } from '../../../lib/ui/components/Typography';
import { ColoursEnum, Fonts } from '../../../lib/ui/design_system';


/*
 * Types
 */

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
  grid-area: 2 /1 /3 /2;
  border-bottom: 0.5rem ${ColoursEnum.mustard} solid;
  align-self: end;
  text-align: left;
  line-height: 1.5rem;
`;

const MiddleTopRightContainer = styled.div`
  // background: purple;
  grid-area: 2 /2 /3 /3;
  border-bottom: 0.5rem ${ColoursEnum.mustard} solid;
  align-self: end;
  text-align: right;
`;
const MiddleBottomRightContainer = styled.div`
  // background: purple;
  grid-area: 3 /2 /3 /3;
  margin-top: 0.25rem;
  text-align: right;
`;

const BigText = styled(Paragraph)`
  font-size: ${Fonts.size.XL}
  font-weight: ${Fonts.weight.light}
`;

const BottomContainer = styled.div`
  // background: green;
  grid-area: 4 /1 /span 1 / span 2;
  text-align: left;
  align-self: end;
  padding:
`;

/*
 * Component
 */
export const DataCard = () => {

  return(
  <Grid>
    <TopTextContainer>
      <Paragraph>Over the past <Bold>6 months</Bold></Paragraph>
    </TopTextContainer>
    <MiddleTopLeftContainer>
      <Paragraph>Most volunteer days were in</Paragraph>
      <Paragraph><Bold>Sept and July</Bold></Paragraph>
    </MiddleTopLeftContainer>
    <MiddleTopRightContainer>
      <BigText>600</BigText>
    </MiddleTopRightContainer>
    <MiddleBottomRightContainer>
      <Paragraph>hours each</Paragraph>
    </MiddleBottomRightContainer>
    <BottomContainer>
      <Paragraph>Over the past <Bold>6 months</Bold></Paragraph>
    </BottomContainer>
  </Grid>);
};

