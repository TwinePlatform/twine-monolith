import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';
import { Text } from "react-native";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NavigationInjectedProps } from 'react-navigation';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import Page from '../../../lib/ui/Page';
import { FontsEnum } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
const logo = require('../../../../assets/images/Error.png');

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Container = styled.View`
  flex: 2;
  justifyContent: center;
  width: 288px;
  alignItems: center;
`;

const Image = styled.Image`
  width: 173px;
  height: 173px;
`;

const TextAbove = styled.Text`
  color: ${ColoursEnum.error};
  fontSize: 30px;
  marginTop: 0px;
  marginBottom: 30px;
  fontFamily: ${FontsEnum.regular};
`

const TextBottom = styled.Text`
  color: ${ColoursEnum.error};
  fontSize: 16px;
  textAlign: center;
  marginTop: 30px;
  marginBottom: 50px;
  fontFamily: ${FontsEnum.regular};
`

/*
 * Component
 */

const Error: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

  const onSubmit = async () => {
    console.log("clicked!");
  };

  return (
    <Page heading="">
      <Container>
        <TextAbove>Oops!</TextAbove>
        <Image source={logo} />
        <TextBottom>*Something is not right, please select an option</TextBottom>
        <SubmitButton marginBottom='10' text="Try Again" onPress={() => onSubmit()} />
        <SubmitButton text="Home" onPress={() => onSubmit()} />
      </Container>
    </Page>
  )
};

export default Error;

