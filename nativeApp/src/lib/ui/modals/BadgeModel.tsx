import React, { FC } from 'react';
import styled from 'styled-components/native';
// import Modal from 'react-native-modal';
import { Button as B, Card as C } from 'native-base';

import { Heading2 as H2, FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

import {
	Modal,
	StyleSheet,
	View
} from "react-native";


/*
 * Types
 */
type Props = {
	isVisible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title: string;
	text: string;
}

/*
 * Styles
 */
const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.black};
`;

const Card = styled(C)`
	width: 231px;
	height: 291px;
	borderRadius: 5;
	alignItems: center;
`;

const BadgeIcon = styled.View`
  width: 89px;
  flexDirection: row;
	alignItems: center;
	marginLeft: 11px;
	marginTop: 28px;
	marginBottom: 21px
`;

const Image = styled.Image`
  width: 98px;
  height: 134px;
`;

const BadgeDetails = styled.View`
  width: 232px;
  flexDirection: column;
  alignItems: center;
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
	alignItems: center;
	textAlign: center;
  fontSize: 16;
  paddingBottom: 5;
  marginLeft: 4;
`;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		alignItems: "center",
		shadowColor: "#000",
		marginTop: 300,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	}
});

//require the badge images 
const BadgeImages = {
	FirstLog: require('../../../../assets/Badges/Medal1.png'),
	ThridMonth: require('../../../../assets/Badges/3MonthMedal.png'),
	FifthLog: require('../../../../assets/Badges/5thLogMedal.png'),
	SixthMonth: require('../../../../assets/Badges/6MonthMedal.png'),
	TenthHour: require('../../../../assets/Badges/10hoursMedal.png'),
	twentiethHour: require('../../../../assets/Badges/20hoursmedal.png'),
	fiftiethHour: require('../../../../assets/Badges/50hoursmedal.png'),
	AnnMedal: require('../../../../assets/Badges/AnnMedal.png'),
	InviteMedal: require('../../../../assets/Badges/EmailInviteMedal.png'),
};

/*
 * Component
 */
const ConfirmationModal: FC<Props> = ({
	isVisible, badge
}) => (
		<View style={styles.centeredView}>
			<Modal
				isVisible={isVisible}
				transparent={true}
			>
				<View style={styles.modalView}>
					<Card>
						<BadgeIcon>
							<Image source={BadgeImages.FirstLog} />
						</BadgeIcon>
						<BadgeDetails>
							<BadgeTitle> {badge.title}</BadgeTitle>
							<BadgeText> {badge.text}</BadgeText>
						</BadgeDetails>
					</Card>
				</View>
			</Modal>
		</View>
	);

export default ConfirmationModal;
