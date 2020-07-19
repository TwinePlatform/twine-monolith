import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

import { Heading2 as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Line from '../../../lib/ui/Line';

import { Card as C } from 'native-base';

/*
 * Styles
 */
const Card = styled(C)`
	width: 85%;
  marginBottom: 10;
  alignItems: center;
	height: 172px;
	flexDirection: column;
`;

const Heading2 = styled(H)`
	flexGrow: 0;
`;

const HeadingContainer = styled.View`
  width: 100%;
  flexDirection: row;
	alignItems: flex-start;
	marginTop: 13px;
	marginLeft: 20px;
	marginBottom: 5;
`;

const BadgeIcon = styled.View`
  flexDirection: row;
	alignItems: flex-start;
	width: 90%;
	marginTop: 5px;
	marginBottom: 5px;
`;

const Image = styled.Image`
  width: 28px;
	height: 38px;
`;

/*
 * Components
 */

const BadgeImages = {
	FirstLog: require('../../../../assets/Badges/small/Medal1.png'),
	ThridMonth: require('../../../../assets/Badges/small/3MonthMedal.png'),
	// FifthLog: require('../../../../assets/Badges/small/5thLogMedal.png'),
	// SixthMonth: require('../../../../assets/Badges/small/6MonthMedal.png'),
	// TenthHour: require('../../../../assets/Badges/small/10hoursMedal.png'),
	// twentiethHour: require('../../../../assets/Badges/small/20hoursmedal.png'),
	// fiftiethHour: require('../../../../assets/Badges/small/50hoursmedal.png'),
	// AnnMedal: require('../../../../assets/Badges/small/AnnMedal.png'),
	// InviteMedal: require('../../../../assets/Badges/small/EmailInviteMedal.png'),
};

const VolunteersBadgesCard: FC<Props> = (props) => {
	const { badges, name } = props.details;
	return (
		<Card>
			<HeadingContainer>
				<MaterialIcons name="person-outline" outline size={35} color={ColoursEnum.mustard} />
				<Heading2>{name}</Heading2>
			</HeadingContainer>
			<Line />
			<BadgeIcon>
				{badges.map((badge) => (
					<Image source={BadgeImages[badge]} />
				))}
			</BadgeIcon>
		</Card>
	);
}

export default VolunteersBadgesCard;