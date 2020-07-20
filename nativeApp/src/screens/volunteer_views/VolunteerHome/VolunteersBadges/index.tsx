import React, { FC } from 'react';
import styled from 'styled-components/native';

import Page from '../../../../lib/ui/Page';
import { Heading as H } from '../../../../lib/ui/typography';
import VolunteersBadgesCard from './../../../../lib/ui/Badges/VolunteersBadges'

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

const Heading = styled(H)`
	font-weight: 900;
	marginBottom: 25px;
`;


/*
 * Component
 */
const VBObj = [
	{
		name: 'Kara Thrace',
		badges: ['FirstLog', 'ThridMonth', 'FifthLog'],
	},
	{
		name: 'Dr. Lee',
		badges: ['ThridMonth', 'AnnMedal', 'SixthMonth', 'TenthHour', 'twentiethHour', 'fiftiethHour', 'InviteMedal'],
	}
]

// {VBObj.map(element) => (
// 	console.log(element);
// 	return (
// 		<VolunteersBadges badges={element}/>
// 	)
// )}

const VolunteersBadges: FC<Props> = (props) => {
	return (
		<View>
			<Heading>Volunteer's Badges</Heading>
			{VBObj.map((element) => (
				<VolunteersBadgesCard details={element} />
			))}
		</View>
	);
}

export default VolunteersBadges;
