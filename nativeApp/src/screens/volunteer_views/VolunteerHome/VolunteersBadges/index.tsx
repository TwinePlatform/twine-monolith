import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Heading as H } from '../../../../lib/ui/typography';
import VolunteersBadgesCard from './../../../../lib/ui/Badges/VolunteersBadges'
import API from '../../../../api';
import PageNoHeading from '../../../../lib/ui/PageNoHeading';

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
  textAlign: center;
`;

/*
 * Component
 */


const VolunteersBadges: FC<Props> = (props) => {
	const [badgearray, setbadgearray] = useState([]);
	const [done, setDone] = useState(false);

	const getBadge = async () => {
		setbadgearray(await API.Badges.getCBBadges());
	}

	useEffect(() => {
		getBadge();
		setDone(true);
	}, []);

	return (
	<PageNoHeading>
		<View>
			<Heading>Volunteer's Badges</Heading>
			{badgearray.length === 0 && !done && <Text>Loading</Text>}
			{badgearray.length === 0 && done && <Text>There are no badges from your organisation to display.</Text>}
			{
				badgearray.map((element, i) => (
					<VolunteersBadgesCard 
					key={i}
					details={element} />

				))}
		</View>
	</PageNoHeading>
	);
}

export default VolunteersBadges;