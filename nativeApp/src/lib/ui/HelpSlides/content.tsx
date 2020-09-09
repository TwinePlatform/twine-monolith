import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Text, View, SafeAreaView, ImageBackground, StyleSheet, Dimensions } from "react-native";
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
    slide: string,
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
    marginTop: 10px;
    position: absolute;
    top: 30px;
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
    top: 30%;
	alignItems: center;`
	//justifyContent: center;
//`;
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
    left:11px;
    bottom: 10px
`;

const ImageArrowRight = styled.Image`
    width: 18;
    height: 29;
    position: absolute;
    right:11px;
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
        opacity: 0.53,
        backgroundColor: '#FFFFFF'
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
    addTimedetails: require('../../../../assets/HelpSlide/addTimedetails.png'),
    editTime: require('../../../../assets/HelpSlide/editTime.png'),
    addTime: require('../../../../assets/HelpSlide/addTime.png'),

};

const HelpSlidesTemplate: FC<NavigationInjectedProps & Props> = ({ navigation, rightNavigation, leftNavigation, slide, imagename, text }) => {

    return (

        
            <SafeAreaView style={styles.container}>

                <ImageBackground style={styles.image} source={images['background']} >

                    <NavBar>
                        <TouchableOpacity onPress={() => navigation.navigate('slide6')}>
                            <TextRight>skip</TextRight>
                        </TouchableOpacity>
                    </NavBar>

                    <EmptySpace></EmptySpace>

                    <ContainerImage>
                        <Image source={images[imagename]} />
                    </ContainerImage>

                    <TextBottom>J{text}</TextBottom>

                    <ContainerFooter>
                        {slide == 'slide2' &&
                            <ContainerFooterCenter>

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide1')}
                                >
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.circleSmallCurrent}
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

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide6')}
                                >
                                </TouchableOpacity>

                            </ContainerFooterCenter>
                        }

                        {slide == 'slide3' &&
                            <ContainerFooterCenter>

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide1')}
                                >
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide2')}
                                >
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.circleSmallCurrent}
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

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide6')}
                                >
                                </TouchableOpacity>

                            </ContainerFooterCenter>
                        }

                        {slide == 'slide4' &&
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

                                <TouchableOpacity style={styles.circleSmallCurrent}
                                    onPress={() => navigation.navigate('slide4')}
                                >
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide5')}
                                >
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide6')}
                                >
                                </TouchableOpacity>

                            </ContainerFooterCenter>
                        }

                        {slide == 'slide5' &&
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

                                <TouchableOpacity style={styles.circleSmallCurrent}
                                    onPress={() => navigation.navigate('slide5')}
                                >
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.circleSmall}
                                    onPress={() => navigation.navigate('slide6')}
                                >
                                </TouchableOpacity>

                            </ContainerFooterCenter>
                        }

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
            </SafeAreaView>
   
    )
};

export default HelpSlidesTemplate;

