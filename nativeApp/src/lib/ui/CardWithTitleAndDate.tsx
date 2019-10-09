import React, { FC } from 'react';
import styled from 'styled-components/native';
import { ColoursEnum } from './colours';
import { FontsEnum, Heading2 } from './typography';
import CardWithButtons, { RemoveType } from './CardWithButtons';


/*
 * Types
 */
type Props = {
  id: number;
  title: string;
  datePrefix: 'Joined' | 'Created';
  date: string;
  removeType: RemoveType;
}

/*
 * Styles
 */

const ValueContainer = styled.View`
  width: 100%;
  flexDirection: row;
  alignItems: flex-end;
  marginBottom: 5;
`;

const DetailsContainer = styled.View`
  flexDirection: row;
  alignItems: flex-end;
`;

const LabelContainer = styled.View`
  flexDirection: column;
  flex: 1;
`;

const Label = styled.Text<{bold?: boolean; textAlign: string}>`
  textAlign: ${(props) => props.textAlign};
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${(props) => (props.bold ? FontsEnum.medium : FontsEnum.light)}
  fontSize: 15;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;


/*
 * Component
 */
const CardWithTitleAndDate: FC<Props> = (props) => {
  const {
    title, datePrefix, date, removeType,
  } = props;
  return (
    <CardWithButtons removeType={removeType}>
      <ValueContainer>
        <Heading2>{title}</Heading2>
      </ValueContainer>
      <DetailsContainer>
        <LabelContainer>
          <Label textAlign="left">{`${datePrefix}: ${date}`}</Label>
        </LabelContainer>
      </DetailsContainer>
    </CardWithButtons>
  );
};

export default CardWithTitleAndDate;
