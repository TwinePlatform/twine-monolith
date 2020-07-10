import React, { FC } from 'react';
import styled from 'styled-components/native';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';

import { Card as C, Header, Content, CardItem, Body, Text } from 'native-base';
import { Heading2 as H2 } from '../../../lib/ui/typography';

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
	FirstLog: require('../../../../assets/Badges/Medal1_small.png'),
	ThridMonth: require('../../../../assets/Badges/3MonthMedal_small.png'),
	FifthLog: require('../../../../assets/Badges/5thLogMedal_small.png'),
	SixthMonth: require('../../../../assets/Badges/6MonthMedal_small.png'),
	TenthHour: require('../../../../assets/Badges/10hoursMedal_small.png'),
	twentiethHour: require('../../../../assets/Badges/20hoursmedal_small.png'),
	fiftiethHour: require('../../../../assets/Badges/50hoursmedal_small.png'),
	AnnMedal: require('../../../../assets/Badges/AnnMedal_small.png'),
	InviteMedal: require('../../../../assets/Badges/EmailInviteMedal_small.png'),
};

/*
 * Components
 */

export const BadgeCard = (props) => {
	const { image, text, title } = props.badge;
	const badgeimage = props.badge.img; //Fix: somehow destructing the image didn't work 
	console.log('here');
	console.log(title);
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

