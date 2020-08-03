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


/*
 * Component
 */
// const VBObj = [
// 	{
// 		name: 'Kara Thrace',
// 		badges: [1, 2, 3],
// 	},
// 	{
// 		name: 'Dr. Lee',
// 		badges: ['ThridMonth', 'AnnMedal', 'SixthMonth', 'TenthHour', 'twentiethHour', 'fiftiethHour', 'InviteMedal'],
// 	}
// ]

// {VBObj.map(element) => (
// 	console.log(element);
// 	return (
// 		<VolunteersBadges badges={element}/>
// 	)
// )}

const VolunteersBadges: FC<Props> = (props) => {
	const [badgearray, setbadgearray] = useState([]);

	// [
	// 	{
	// 	  award_id: [ 1, 100, 102 ],
	// 	  user_account_id: 6,
	// 	  user_name: 'Emma Emmerich'
	// 	},
	// 	{ award_id: [ 1 ], user_account_id: 7, user_name: 'Raiden' }
	//   ]

	const getBadge = async () => {
		setbadgearray(await API.Badges.getCBBadges());
		console.log(badgearray);
		// var VBObj: any = [];
		// badgeArr.forEach(volunteer => {
		// 	VBObj.push(volunteer.user_name, volunteer.award_id)
		// })
		// setbadgearray(badgeArr);
	}

	useEffect(() => {
		getBadge();
	})

	//get volunteers
	//getbadges for each volunteer 
	//show badges for each volunteer 

	return (
		<View>
			<Heading>Volunteer's Badges</Heading>
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