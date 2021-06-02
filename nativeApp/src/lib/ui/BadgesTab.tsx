import React, { FC } from 'react';
import styled from 'styled-components/native';
import { BadgeObj } from './Badges/BadgeObject';
import { BadgeCard } from './Badges/BadgesCard';

type Props = {
    loading: boolean;
    badge: any[];
}

const CardView = styled.View`
  /*flexDirection: column;*/
  alignItems: center;
  flex: 1;
`;

const Text = styled.Text`
  width:100%;
  textAlign: center;
`;

export const BadgesTab: FC<Props> = (props) => {
    console.log(props);
    return (
      <CardView>
        {props.loading === true && <Text>Loading</Text>}
        {
          props.badge.map((element) => {
            const awardId = element['award_id'];
            if (awardId == 100) {
              return (<BadgeCard badge={BadgeObj['FirstLogBadge']} />)
            } else if (awardId >> 100) {
              return (<BadgeCard badge={BadgeObj['FifthLogBadge']} />)
            } else {
              const badgename = Object.keys(BadgeObj)[awardId - 1];
              return (
                <BadgeCard badge={BadgeObj[badgename]} />
              )
            }
          })
        }
        {
          props.badge.length === 0 && <Text>No badges yet!</Text>
        }
      </CardView >
    );
};