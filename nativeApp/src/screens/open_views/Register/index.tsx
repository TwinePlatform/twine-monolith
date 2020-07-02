import React, {useState, FC, useEffect} from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Picker, TextInput, View ,Text} from 'react-native';
import { Input as I} from 'native-base';
import DropdownNoLabel from '../../../lib/ui/forms/DropdownNoLabel';
import FuzzySearchBox from '../../../lib/ui/forms/FuzzySearchBox';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import MessageModal from '../../../lib/ui/modals/MessageModal';

import { ColoursEnum } from '../../../lib/ui/colours';
import Page from '../../../lib/ui/Page';
import API from '../../../api';

/*
 * Types
 */
type Props = {
  navigation: NavigationScreenProp<NavigationState, {}>;
};

/*
 * Styles
 */

const LinkText = styled.Text`
  textAlign: center;
  color: ${ColoursEnum.blue};
  fontSize: 17;
`;

const Input = styled(I)`
  borderBottomWidth: 2;
  borderBottomColor: ${ColoursEnum.lightGrey};
  marginLeft: 0;
`;


// const Text = styled.Text`
//   font-size: 15;
// `;

const formOptions = [{id: 1, name: "Organisation"}, {id: 2 , name:"User"}];
const yearOptions = [...Array(100).keys()].map((_, i) => ({ id: i, name: `${2005 - i}` }));
const genderOptions = [{id: 1, name: "female"}, {id: 2 , name:"male"},{id: 3, name: "prefer not to say"}]

const thankYouMessage = "\nThank you for registering!\nYou should have received\nan email with your admin code.\n\nPlease now register as a user\nand enter your admin code."
/*
 * Component
 */
const Register: FC<Props> = (props) => {
  const [registrationType, setRegistrationType] = useState("Organisation");
  const [organisationModalVisible, setOrganisationModalVisible] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [organisationOptions, setOrganisationOptions] = useState([{id: 1, name: "loading organisations"}])
  
  const [organisationName, setOrganisationName] = useState("");
  const [organisationEmail, setOrganisationEmail] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPostCode, setUserPostCode] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userYearOfBirth, setUserYearOfBirth] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userOrganisation, setUserOrganisation] = useState("");
  const [userAdminCode, setUserAdminCode] = useState("");

  useEffect( ()=>{
    if(!initialised){
      API.CommunityBusiness.get()
      .then(res => { console.log(res.data)
        //setOrganisationOptions(res.data)
      });
      setInitialised(true)
    }
  }
      
  );

  const onSubmit = () => {
    if(registrationType === "User")
     /* API.Volunteers.add({
          organisationId: id.required(),
          role: Joi.alternatives(RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN).required(),
          adminCode: Joi.string().regex(/^\w{5,8}$/),
          name: userName.required(),
          gender: gender.default('prefer not to say'),
          birthYear: birthYear.default(null),
          email: email.required(),
          phoneNumber: phoneNumber.allow(''),
          postCode: postCode.allow(''),
          password: password,
      });*/{
        
      }
    if(registrationType === "Organisation"){
      /*API.CommunityBusiness.add({

      });
      toggleOrgModal();*/
      console.log("name: " + organisationName + "\n" + "email: " + organisationEmail );
      setOrganisationModalVisible(true);
    }
      
  }

  if(registrationType === "Organisation")
    return (
      <Page heading="Register">
        <MessageModal 
          isVisible={organisationModalVisible} 
          message={thankYouMessage} 
          onClose={()=>{setOrganisationModalVisible(false);setRegistrationType("User");}}/>
        <DropdownNoLabel
          options={formOptions} selectedValue={registrationType} onValueChange={setRegistrationType}
        />
        <Input placeholder={"Organisation Name"} onChangeText={text => setOrganisationName(text)}/>
        <Input placeholder={"Email"} onChangeText={text => setOrganisationEmail(text)}/>
        <SubmitButton text="COMPLETE" onPress={onSubmit} />
        <LinkText onPress={() => props.navigation.navigate('TnC')}>
          Terms and Conditions
        </LinkText>
        <LinkText onPress={() => props.navigation.navigate('Login')}>
          Already Registered? Log In Here
        </LinkText>
      </Page>
    );
  if(registrationType === "User")
      return (
    <Page heading="Register">
      <DropdownNoLabel
          options={formOptions} selectedValue={registrationType} onValueChange={setRegistrationType}
        />      
      <Input placeholder={"Name"} onChangeText={text => setUserName(text)}/>
      <Input placeholder={"Email"} onChangeText={text => setUserEmail(text)}/>
      <Input placeholder={"Password"} onChangeText={text => setUserPassword(text)}/>
      <Input placeholder={"Phone Number"} onChangeText={text => setUserPhoneNumber(text)}/>
      <Input placeholder={"Postcode"} onChangeText={text => setUserPostCode(text)}/>
      <DropdownNoLabel
          options={yearOptions} selectedValue={userYearOfBirth} onValueChange={setUserYearOfBirth}
        /> 
      <DropdownNoLabel
          options={genderOptions} selectedValue={userGender} onValueChange={setUserGender}
        /> 
      <FuzzySearchBox label="" placeholder={"Find Organisation"} options={organisationOptions} selectedValue={userOrganisation} onValueChange={setUserOrganisation} />
      <Input placeholder={"Admin Access Code (Admin Required)"} onChangeText={text => setUserAdminCode(text)}/>
      <SubmitButton text="COMPLETE" onPress={onSubmit} />
      <LinkText onPress={() => props.navigation.navigate('TnC')}>
          Terms and Conditions
        </LinkText>
      <LinkText onPress={() => props.navigation.navigate('Login')}>
          Already Registered
      </LinkText>
    </Page>
    );
}

export default Register;