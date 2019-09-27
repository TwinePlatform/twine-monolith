import React from 'react';
import styled from 'styled-components/native'
import { Fonts } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';


const StatContainer = styled.View`
  width: 100%;
  marginTop: 10;
  marginBottom: 10;

`;

const SubheadingContainer = styled.View`
  width: 100%;
  flexDirection: row;
  alignItems: center;
  justifyContent: flex-start;
`;

const Subheading = styled.Text`
  marginLeft: 15;
  color: ${ColoursEnum.darkGrey};
  fontSize: 15;
  letterSpacing: 1.5;
`;

const ValueContainer = styled.View`
  width: 100%;
  flexDirection: row;
  alignItems: flex-end;
`;

const Value = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontSize: 50;
  font-family: ${Fonts.medium}
  paddingLeft:2;
`;

const Unit = styled.Text`
  marginLeft: 15;
  color: ${ColoursEnum.darkGrey};
  fontSize: 20;
  letterSpacing: 1.2;
  paddingBottom: 10;
`;

const Stat = (props) =>{
  const {heading, children:icon, value, unit} = props;
  return (
    <StatContainer>
      <SubheadingContainer>
        {icon}
        <Subheading>{heading}</Subheading>
      </SubheadingContainer>
      <ValueContainer>
        <Value>{value}</Value>
        <Unit>{unit}</Unit>
      </ValueContainer>
    </StatContainer>
  )}

export default Stat;
