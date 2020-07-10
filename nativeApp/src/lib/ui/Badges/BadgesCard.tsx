import React, { FC } from 'react';
import styled from 'styled-components/native';

import { ColoursEnum } from '../../../lib/ui/colours';

import { Card as C } from 'native-base';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

const Card = styled(C)`
  width: 85%;
  marginBottom: 10;
  alignItems: center;
	height: 101px;
	flexDirection: row;
  justifyContent: space-around;
`;

const BadgeIcon = styled.View`
  width: 89px;
  flexDirection: row;
	alignItems: flex-start;
	marginLeft: 11px;
`;

const Image = styled.Image`
  width: 61px;
  height: 84px;
`;

const BadgeDetails = styled.View`
  width: 232px;
  flexDirection: column;
  alignItems: flex-start;
`;

const BadgeTitle = styled.Text`
  color: ${ColoursEnum.black};
  fontSize: 26;
  fontWeight: bold;
  paddingBottom: 5;
  marginLeft: 4;
`;

const BadgeText = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontSize: 16;
  paddingBottom: 5;
  marginLeft: 4;
`;

//require the badge images 
const BadgeImages = {
	FirstLog: require('../../../../assets/Badges/medium/Medal1_small.png'),
	ThridMonth: require('../../../../assets/Badges/medium/3MonthMedal_small.png'),
	FifthLog: require('../../../../assets/Badges/medium/5thLogMedal_small.png'),
	SixthMonth: require('../../../../assets/Badges/medium/6MonthMedal_small.png'),
	TenthHour: require('../../../../assets/Badges/medium/10hoursMedal_small.png'),
	twentiethHour: require('../../../../assets/Badges/medium/20hoursmedal_small.png'),
	fiftiethHour: require('../../../../assets/Badges/medium/50hoursmedal_small.png'),
	AnnMedal: require('../../../../assets/Badges/medium/AnnMedal_small.png'),
	InviteMedal: require('../../../../assets/Badges/medium/EmailInviteMedal_small.png'),
};

/*
 * Components
 */

export const BadgeCard = (props) => {
	const { image, text, title } = props.badge;
	const badgeimage = props.badge.img; //Fix: somehow destructing the image didn't work 
	return (
		<Card>
			<BadgeIcon>
				<Image source={BadgeImages[badgeimage]} />
			</BadgeIcon>

			<BadgeDetails>
				<BadgeTitle> {title}</BadgeTitle>
				<BadgeText> {text}</BadgeText>
			</BadgeDetails>
		</Card>
	);
};

