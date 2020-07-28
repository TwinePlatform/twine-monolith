import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text, View, ImageBackground, StyleSheet, Dimensions, Linking, AsyncStorage } from "react-native";
import { NavigationInjectedProps } from 'react-navigation';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import { FontsEnum } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import { TouchableOpacity } from 'react-native';
const arrowRight = require('../../../../assets/HelpSlide/NextArrow.png');
const arrowLeft = require('../../../../assets/HelpSlide/NextArrowLeft.png');
import Modal from 'react-native-modal';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Scrollable = styled.ScrollView`
`;

const NavBar = styled.View`
	width: 100%;
	height: 54px;
	marginTop: 20px;
`;

const TextRight = styled.Text`
	textAlign: right;
	fontSize: 40px;
	marginRight: 13px;
	color: ${ColoursEnum.purple};
`;

const EmptySpace = styled.View`
	width: 100%;
	height: 50px;
`;

const ContainerImage = styled.View`
	alignItems: center;
	justifyContent: center;
`;
const Image = styled.Image`
  width: 262px;
  height: 398px;
`;

const ContainerSub = styled.View`
	alignItems: center;
	textAlign: center;
	flexDirection: row;
	marginBottom: 80px;
	width: 100%;
	justifyContent: center;
`;

const Sub = styled.Text`
	textAlign: center;
  fontSize: 14px;
  marginTop: 16px;
  fontFamily: ${FontsEnum.light};
`

const Sublink = styled.Text`
	color: ${ColoursEnum.blue};
	fontSize: 14px;
	marginTop: 16px;
	fontFamily: ${FontsEnum.light};
	textDecoration: underline;
	textDecorationColor: ${ColoursEnum.blue};
	textAlign: center;
`

const TextBottom = styled.Text`
  fontSize: 25px;
  textAlign: center;
  marginTop: 15px;
	fontFamily: ${FontsEnum.light};
	color: #707070;
	
`

const ContainerFooter = styled.View`
	width: 100%
	height: 47px;
	marginBottom: 20px;
	flexDirection: row;
`;

const ContainerImageLeft = styled.View`
	alignItems: center;
	position: absolute;
	left:33px;
`;

const ContainerImageRight = styled.View`
	alignItems: center;
	position: absolute;
	right: 33px;
`;

const ImageArrowLeft = styled.Image`
	width: 18;
	height: 29;
	position: absolute;
	left:20px;
	bottom: 10px
`;

const ImageArrowRight = styled.Image`
	width: 18;
	height: 29;
	position: absolute;
	right:20px;
	bottom: 10px
`;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column"
	},
	image: {
		flex: 1,
		height: Dimensions.get('window').height,
		resizeMode: "cover",
		justifyContent: "center",
	},
	circle: {
		width: 47,
		height: 47,
		borderRadius: 47 / 2,
		backgroundColor: '#FFFFFF'
	}
});

/*
 * Component
 */

const images = {
	slide2: require('../../../../assets/HelpSlide/slide6.png'),
	imagename: require('../../../../assets/HelpSlide/lastSlide.png'),
};

const HelpSlidesEnd: FC<NavigationInjectedProps & Props> = ({ navigation }) => {

	let navigateExit;
	AsyncStorage.getItem('HelpSlides').then(val => {
		if (!val) {
			navigateExit = 'AuthStack'
			AsyncStorage.setItem('HelpSlides', 'loaded');
		}
		else {
			navigateExit = 'SettingsPage';
		}
	})




	return (

		<Scrollable>
			<View style={styles.container}>

				<ImageBackground style={styles.image} source={images['slide2']} >

					<NavBar>
						<TouchableOpacity onPress={() => navigation.navigate(navigateExit)}>
							<TextRight>X</TextRight>
						</TouchableOpacity>
					</NavBar>

					<EmptySpace></EmptySpace>

					<ContainerImage>
						<Image source={images['imagename']} />
					</ContainerImage>

					<TextBottom>Invite your friends..</TextBottom>

					<ContainerSub>
						<Sub> You can find more help at our&nbsp;</Sub>
						<TouchableOpacity>
							<Sublink onPress={() => Linking.openURL('https://www.twine-together.com/')}> website </Sublink>
						</TouchableOpacity>
					</ContainerSub>

					<ContainerFooter>
						<ContainerImageLeft>
							<TouchableOpacity style={styles.circle}
								onPress={() => navigation.navigate('slide5')}
							>
								<ImageArrowLeft source={arrowLeft} />
							</TouchableOpacity>
						</ContainerImageLeft>

					</ContainerFooter>
				</ImageBackground>
			</View>
		</Scrollable>
	)
};

export default HelpSlidesEnd;

