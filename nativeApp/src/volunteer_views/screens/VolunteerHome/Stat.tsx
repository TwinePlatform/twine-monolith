import React, { FC } from 'react';
import styled from 'styled-components/native'
import { FontsEnum } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';


/*
 * Types
 */
type Props = {
  heading: string;
  value: string; 
  unit: string;
}

/*
 * Styles
 */
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
  font-family: ${FontsEnum.medium}
  paddingLeft:2;
`;

const Unit = styled.Text`
  marginLeft: 15;
  color: ${ColoursEnum.darkGrey};
  fontSize: 20;
  letterSpacing: 1.2;
  paddingBottom: 10;
`;

/*
 * Component
 */
const Stat: FC<Props> = (props) =>{
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
