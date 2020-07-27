import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text, View, ImageBackground, StyleSheet, Dimensions } from "react-native";
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
    backgroundname: string,
    imagename: string,
    text: string
    rightNavigation?: string,
    leftNavigation?: string
}

/*
 * Styles
 */
const Scrollable = styled.ScrollView`
`;

const NavBar = styled.View`
	width: 100%;
	height: 24px;
	marginTop: 20px;
`;

const TextRight = styled.Text`
	textAlign: right;
	fontSize: 20px;
	marginRight: 13px;
	color: ${ColoursEnum.purple};
    text-decoration: underline;
    textDecorationColor:${ColoursEnum.purple};
`;

const EmptySpace = styled.View`
	width: 100%;
	height: 150px;
`;

const ContainerImage = styled.View`
	alignItems: center;
	justifyContent: center;
`;
const Image = styled.Image`
  width: 186px;
  height: 315px;
`;

const TextAbove = styled.Text`
  color: ${ColoursEnum.error};
  fontSize: 30px;
  marginTop: 0px;
  marginBottom: 30px;
  fontFamily: ${FontsEnum.regular};
`
const TextBottom = styled.Text`
  fontSize: 25px;
  textAlign: center;
  marginTop: 15px;
  marginBottom: 140px;
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
    slide2: require('../../../../assets/HelpSlide/slide2.png'),
    slide3: require('../../../../assets/HelpSlide/slide3.png'),
    slide4: require('../../../../assets/HelpSlide/slide4.png'),
    slide5: require('../../../../assets/HelpSlide/slide5.png'),
    addTimedetails: require('../../../../assets/HelpSlide/addTimedetails.png'),
    editTime: require('../../../../assets/HelpSlide/editTime.png'),
    addTime: require('../../../../assets/HelpSlide/addTime.png'),

};

const HelpSlidesTemplate: FC<NavigationInjectedProps & Props> = ({ navigation, rightNavigation, leftNavigation, backgroundname, imagename, text }) => {

    return (

        <Scrollable>
            <View style={styles.container}>

                <ImageBackground style={styles.image} source={images[backgroundname]} >

                    <NavBar>
                        <TouchableOpacity onPress={() => navigation.navigate('slide6')}>
                            <TextRight>skip</TextRight>
                        </TouchableOpacity>
                    </NavBar>

                    <EmptySpace></EmptySpace>

                    <ContainerImage>
                        <Image source={images[imagename]} />
                    </ContainerImage>

                    <TextBottom>{text}</TextBottom>

                    <ContainerFooter>
                        {leftNavigation &&
                            <ContainerImageLeft>
                                <TouchableOpacity style={styles.circle}
                                    onPress={() => navigation.navigate(leftNavigation)}
                                >
                                    <ImageArrowLeft source={arrowLeft} />
                                </TouchableOpacity>

                            </ContainerImageLeft>}

                        {rightNavigation &&
                            <ContainerImageRight>
                                <TouchableOpacity style={styles.circle}
                                    onPress={() => navigation.navigate(rightNavigation)}
                                >
                                    <ImageArrowRight source={arrowRight} />
                                </TouchableOpacity>
                            </ContainerImageRight>
                        }

                    </ContainerFooter>
                </ImageBackground>
            </View>
        </Scrollable>
    )
};

export default HelpSlidesTemplate;

