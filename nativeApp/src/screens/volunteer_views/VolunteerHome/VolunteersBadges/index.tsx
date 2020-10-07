import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';

import Page from '../../../../lib/ui/Page';
import { Heading as H } from '../../../../lib/ui/typography';
import VolunteersBadgesCard from './../../../../lib/ui/Badges/VolunteersBadges'
import API from '../../../../api';

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

const Text = styled.Text`
  width:100%;
`;

/*
 * Component
 */


const VolunteersBadges: FC<Props> = (props) => {
	const [badgearray, setbadgearray] = useState([]);

	const getBadge = async () => {
		setbadgearray(await API.Badges.getCBBadges());
	}


	useEffect(() => {
		getBadge();
	}, []);
	console.log(badgearray);
	return (
		<View>
			<Heading>Volunteer's Badges</Heading>
			{badgearray == [] && <Text>Loading</Text>}
			{
				badgearray.map((element) => (
					<VolunteersBadgesCard details={element} />

				))}
		</View>
	);
}

export default VolunteersBadges;


{/* <CardView>
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
</CardView > */}