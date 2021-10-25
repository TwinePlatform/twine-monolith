import React, { FC, useState, useEffect} from 'react';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import {useSelector, useDispatch, shallowEqual } from 'react-redux';
import {openModal, closeModal, selectModalStatus} from '../../../redux/entities/support';

import { Form as F } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import SupportModal from '../../../lib/ui/modals/SupportModal';
import Input from '../../../lib/ui/forms/InputWithIcon';
import { ColoursEnum } from '../../../lib/ui/colours';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import API from '../../../api';
import { StorageValuesEnum } from '../../../authentication/types';
import { ErrorText } from '../../../lib/ui/typography';
const logo = require('../../../../assets/images/logo_image.png');

/*
 * Types
 */
type Props = {
  navigation: NavigationScreenProp<NavigationState, {}>;
};

/*
 * Styles
 */
const Page = styled.View`
  flex: 1;
  justifyContent: space-around;
  flexDirection: column;
  alignItems: center;
`;

const Container = styled.View`
  flex: 3;
  justifyContent: center;
  width: 100%;
  alignItems: center;
`;

const BottomContainer = styled(Container)`
  flex: 2;
  justifyContent: space-between;
  paddingBottom: 20;
`;

const LinkText = styled.Text`
  textAlign: center;
  color: ${ColoursEnum.blue};
  fontSize: 17;
`;

const Image = styled.Image`
  width: 100;
  height: 100;
`;

const Form = styled(F)`
  width: 75%;
`;

/*
 * Component
 */
const Login: FC<Props> = (props) => {
  const [logoVisible, setLogoVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setError] = useState("");

  const [initialised,setInitialised] = useState(false);

  const dispatch = useDispatch();
  const {modalOpen} = useSelector(selectModalStatus,shallowEqual);

  const onSubmit = async () => {

    try {
      //       const data = await API.Authentication.login({ email, password });
      //       await AsyncStorage.setItem(StorageValuesEnum.USER_TOKEN, data.data.token);

      const { data } = await API.Authentication.login({ email, password });
      await AsyncStorage.setItem(StorageValuesEnum.USER_TOKEN, data.token);
      await AsyncStorage.setItem(StorageValuesEnum.USER_ID, data.userId.toString());
      await AsyncStorage.setItem(StorageValuesEnum.RECENT_LOGIN,`{"email": "${email}", "password": "${password}"}`)
      props.navigation.navigate('AuthenticationLoader');
    } catch (error) {
      setError(error.response.data.error.message);
      // handle error response
    }
  };

  useEffect(() => {
    console.log(initialised)

    if(!initialised){
      AsyncStorage.getItem(StorageValuesEnum.RECENT_LOGIN).then(values => {
        console.log(values);
        if(values != null){
          const json = JSON.parse(values);
          setEmail(json.email);
          setPassword(json.password);
        }
      });

      setInitialised(true);
    }

    AsyncStorage.getItem('HelpSlides').then(val => {
      console.log(val);
      if (!val) {
        props.navigation.navigate('HelpSlideStack');
      }
    })
  }, []);

  if (serverError == 'Unknown account') {
    setError(`This email address doesn’t appear to be registered to Twine Volunteer.`);
  }

  if (serverError == 'Incorrect password') {
    setError(`Your password is incorrect. If forgotten, you can reset it below.`);
  }

  return (
    <Page>
      <SupportModal isVisible={modalOpen} closeFunction={()=>dispatch(closeModal())}/>
      {logoVisible && <Container>
        <Image source={logo} 
        />
      </Container>}

      <Container>
        <Form>
          <Input 
            name="Email" 
            autoCompleteType="email" 
            value={email} 
            onChangeText={text=>setEmail(text)}
            onFocus={()=>setLogoVisible(false)} 
          >
            <MaterialCommunityIcons name="email-outline" outline size={27} color={ColoursEnum.grey} />
          </Input>
          <Input
            name="Password"
            autoCompleteType="password"
            secureTextEntry
            value={password}
            onChangeText={text=>setPassword(text)}
            onFocus={()=>setLogoVisible(false)} 
          >
            <MaterialCommunityIcons name="lock-outline" size={27} color={ColoursEnum.grey} />
          </Input>
          <SubmitButton 
          //marginBottom='0' 
          text="LOG IN" onPress={() => onSubmit()} />
          {serverError.length > 0 && 
            <ErrorText>*{serverError.toString()}</ErrorText>
          }
        </Form>
      </Container>
      <BottomContainer>
        <LinkText onPress={() => dispatch(openModal())}>
          Having technical issues with TWINE?
        </LinkText>
        <LinkText onPress={() => Linking.openURL('https://data.twine-together.com/password/forgot')}>
          Forgot password
        </LinkText>
        <LinkText onPress={() => props.navigation.navigate('Register')}>
          Register here
        </LinkText>
      </BottomContainer>
    </Page>
  );
};

export default Login;
