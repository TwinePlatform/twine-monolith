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
import { TouchableOpacity } from 'react-native';

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

const Submit = styled.View`
  width: 100%;
  height: 48px;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  marginBottom: ${props => props.marginBottom || 40};
  border-radius: 5px;
  box-shadow: 0px 2px 3px #33333333;
  shadow-radius: 3;
  elevation: 1;
  shadow-opacity: 1;
`;

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

        <TouchableOpacity
          onPress={() => onSubmit()}
        >
          <Submit marginBottom='10'>
            <SubmitText >Try Again</SubmitText>
          </Submit>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSubmit()}
        >
          <Submit marginBottom='10'>
            <SubmitText >Home</SubmitText>
          </Submit>
        </TouchableOpacity>

      </Container>
    </Page>
  )
};

export default Error;

