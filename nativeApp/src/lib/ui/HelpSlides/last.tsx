import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text, View, ImageBackground, StyleSheet, Dimensions, Linking, AsyncStorage } from "react-native";
import { NavigationInjectedProps } from 'react-navigation';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import { FontsEnum } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import { TouchableOpacity } from 'react-native';
const arrowRight = require('../../../../assets/HelpSlide/NextArrowRight.png');
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
	marginTop: 20px;
	marginBottom: 20px;
    flexDirection: row;
    alignItems: center;
    position: absolute;
    bottom: 20px;
`;

const ContainerFooterCenter = styled.View`
    width: 200px;
    marginLeft: 80px;
    flexDirection: row;
    justifyContent: space-around;
    alignItems: center;
`;

const ContainerImageLeft = styled.View`
	alignItems: center;
	position: absolute;
    left:40px;
    bottom: 0px;
`;

const ContainerImageRight = styled.View`
	alignItems: center;
	position: absolute;
    right: 40px;
    bottom: 0px;
`;

const ImageArrowLeft = styled.Image`
    width: 50;
    height: 50;
`;

const ImageArrowRight = styled.Image`
    width: 50;
    height: 50;
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
	circleSmall: {
		width: 14,
		height: 14,
		borderRadius: 14 / 2,
		backgroundColor: '#707070'
	},
	circleSmallCurrent: {
		width: 14,
		height: 14,
		borderRadius: 14 / 2,
		backgroundColor: '#8000FF'
	}
});

/*
 * Component
 */

const images = {
	background: require('../../../../assets/HelpSlide/background.png'),
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

				<ImageBackground style={styles.image} source={images['background']} >

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

						<ContainerFooterCenter>

							<TouchableOpacity style={styles.circleSmall}
								onPress={() => navigation.navigate('slide1')}
							>
							</TouchableOpacity>

							<TouchableOpacity style={styles.circleSmall}
								onPress={() => navigation.navigate('slide2')}
							>
							</TouchableOpacity>

							<TouchableOpacity style={styles.circleSmall}
								onPress={() => navigation.navigate('slide3')}
							>
							</TouchableOpacity>

							<TouchableOpacity style={styles.circleSmall}
								onPress={() => navigation.navigate('slide4')}
							>
							</TouchableOpacity>

							<TouchableOpacity style={styles.circleSmall}
								onPress={() => navigation.navigate('slide5')}
							>
							</TouchableOpacity>

							<TouchableOpacity style={styles.circleSmallCurrent}
								onPress={() => navigation.navigate('slide6')}
							>
							</TouchableOpacity>

						</ContainerFooterCenter>
						<ContainerImageLeft>
							<TouchableOpacity
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

