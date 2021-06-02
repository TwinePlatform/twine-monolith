import React, { useState, FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Picker, TextInput, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Input as I } from 'native-base';
import DropdownShort from '../../../lib/ui/forms/DropdownShort';
import DropdownNoLabel from '../../../lib/ui/forms/DropdownNoLabel';
import FuzzySearchBox from '../../../lib/ui/forms/FuzzySearchBox';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import MessageModal from '../../../lib/ui/modals/MessageModal';
import { ErrorText } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Page from '../../../lib/ui/Page';
import API from '../../../api';

import { Formik } from 'formik';
import * as yup from 'yup';

/*
 * Types
 */
type Props = {
  navigation: NavigationScreenProp<NavigationState, {}>;
};

/*
 * Styles
 */
const SuccessText = (props) => {
  if (props.visible)
    return <View
      style={{ position: 'absolute', top: '50%', backgroundColor: 'white' }}
    >
      <Text style={{ color: ColoursEnum.purple, fontSize: 20, textAlign: 'center' }}>{props.text}</Text>
    </View>
  else
    return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const Registration = styled.View`
  alignItems: center;
  width: 30%;
  textAlign: center;
`;

const Container = styled.View`
  width: 80%;
  alignItems: center;
`;

const LinkText = styled.Text`
  textAlign: center;
  color: ${ColoursEnum.blue};
  fontSize: 15;
  text-decoration: underline ${ColoursEnum.blue};
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: '#D1D1D1'
})`
  width: 80%;
  height: 35px;
  borderBottomWidth: 1;
  borderBottomColor: ${ColoursEnum.grey};
  marginTop: 10px;
  paddingLeft: 10px;
  `;

const PrintText = styled.Text`
  textAlign: center;
  fontSize: 15;
  marginBottom: 20px;
`;

const FormErrorText = styled.Text`
  width: 80%
  fontSize: 10;
  color: red;
  flex: 1;
  flexWrap: wrap;
`;


const formOptions = [{ id: 1, name: "Organisation" }, { id: 2, name: "User" }];
const yearOptions = [...Array(100).keys()].map((_, i) => ({ id: i, name: `${2005 - i}` }));
// const regionOptions = [{ id: 1, name: "East Midlands" }, { id: 2, name: "East of England" }, { id: 3, name: "London" }, { id: 4, name: "North East" }];
const regionOptions = [{ id: 1, name: "East Midlands" }, { id: 2, name: "East of England" }, { id: 3, name: "London" }, { id: 4, name: "North East" }, { id: 5, name: "North West" }, { id: 6, name: "South East" }, { id: 7, name: "South West" }, { id: 8, name: "West Midlands" }, { id: 9, name: "Yorkshire and The Humber" }, { id: 11, name: "Scotland" }, { id: 12, name: "Wales" }, { id: 13, name: "Northern Ireland" }];
const thankYouMessage = "\nThank you for registering!\nYou should have received\nan email with your admin code.\n\nPlease now register as a user\nand enter your admin code."
/*
 * Component
 */
const Register: FC<Props> = (props) => {
  const [registrationType, setRegistrationType] = useState("User");
  const [organisationModalVisible, setOrganisationModalVisible] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [organisationOptions, setOrganisationOptions] = useState([{ id: 1, name: "loading organisations" }])
  const [serverMsg, setServerMsg] = useState("");
  const [successTextVisible, setSuccessTextVisible] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  const [userYearOfBirth, setUserYearOfBirth] = useState("");
  const [region, setRegion] = useState("");
  const [userOrganisation, setUserOrganisation] = useState({ id: 0, name: "default" });

  const [serverError, setError] = useState("");

  useEffect(() => {
    if (!initialised) {
      initialiseCommunityBusinessOptions();
      setInitialised(true)
    }
  });

  const initialiseCommunityBusinessOptions = async () => {
    let listOfCommunityBusinesses = [];

    regionOptions.map(async (region, index) => {
      const { data } = await API.CommunityBusiness.getByRegion(region.id);
      listOfCommunityBusinesses = listOfCommunityBusinesses.concat(data);

      if (index == regionOptions.length - 1) {
        // console.log(listOfCommunityBusinesses);
        setOrganisationOptions(listOfCommunityBusinesses);
      }
    })
  }

  const validationSchemaOrg = yup.object().shape({
    orgName: yup
      .string()
      .required(),
    adminEmail: yup
      .string()
      .email()
      .required(),
    confirmAdminEmail: yup
      .string()
      .email()
      .required()
      .oneOf([yup.ref('adminEmail'), null], 'email addresses must match'),
    adminName: yup
      .string()
      .required(),
    orgPostCode: yup
      .string()
      .min(4)
      .max(10)
      .required()
  });

  const validationSchemaUser = yup.object().shape({
    name: yup
      .string()
      .required('Please enter your full name'),
    email: yup
      .string()
      .email()
      .required('Please enter your email address. If you don’t have one, an administrator can help you register.'),
    confirmEmail: yup
      .string()
      .email()
      .required()
      .oneOf([yup.ref('email'), null], 'email addresses must match'),
    password: yup
      .string()
      .min(6, 'Please enter a password of at least 6 characters, including one digit (e.g. 1, 2, 3) and one symbol (e.g. !, ?, £)')
      .required('Please enter a password of at least 6 characters, including one digit (e.g. 1, 2, 3) and one symbol (e.g. !, ?, £)'),
    phone: yup
      .number(),
    adminCode: yup
      .string(),
    postCode: yup
      .string()
      .min(4)
      .max(10)
      .required('Postcode is required')
  });

  const registrationTypeDropdown = <Registration>
    <DropdownShort
      options={formOptions} selectedValue={registrationType} onValueChange={value=>{setRegistrationType(value);setSubmitPressed(false)}}
    />
  </Registration>;

  if (registrationType === "Organisation")
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Formik
          validationSchema={validationSchemaOrg}
          onSubmit={async (values) => {
            values.region = region;
            console.log(values);
            let orgObj = {
              "orgName": values.orgName,
              "region": values.region,
              "postCode": values.orgPostCode,
              "adminName": values.adminName,
              "adminEmail": values.adminEmail,
            }
            if (values._360GivingId != "") {
              orgObj._360GivingId = values._360GivingId;
            }
            try {
              const res = await API.CommunityBusiness.register(orgObj);
              if (res.status == 200)
                setOrganisationModalVisible(true);
              initialiseCommunityBusinessOptions();
            }
            catch (error) {
              console.log('registration failed');
              setServerMsg(error.response.data.error.message);
            }
          }}>

          {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
            return (
              <Page heading="Register">

                <MessageModal
                  isVisible={organisationModalVisible}
                  message={thankYouMessage}
                  onClose={() => { setOrganisationModalVisible(false); setRegistrationType("User"); }} />

                {registrationTypeDropdown}

                <Input
                  onChangeText={handleChange('orgName')}
                  onBlur={handleBlur('orgName')}
                  value={values.orgName}
                  placeholder='Organisation Name'
                />
                {errors.orgName && submitPressed &&
                  <FormErrorText>{errors.orgName}</FormErrorText>
                }

                <Input
                  onChangeText={handleChange('adminName')}
                  onBlur={handleBlur('adminName')}
                  value={values.adminName}
                  placeholder='Admin Name'
                />
                {errors.orgName && submitPressed &&
                  <FormErrorText>{errors.adminName}</FormErrorText>
                }

                <Input
                  onChangeText={handleChange('adminEmail')}
                  onBlur={handleBlur('adminEmail')}
                  value={values.adminEmail}
                  placeholder='Organisation Email'
                />

                {errors.adminEmail && submitPressed &&
                  <FormErrorText>{errors.adminEmail}</FormErrorText>
                }

                <Input
                  onChangeText={handleChange('confirmAdminEmail')}
                  onBlur={handleBlur('confirmAdminEmail')}
                  value={values.confirmAdminEmail}
                  placeholder='Confirm Organisation Email'
                  contextMenuHidden={true}
                />

                {errors.confirmAdminEmail && submitPressed &&
                  <FormErrorText>{errors.confirmAdminEmail}</FormErrorText>
                }

                <Input
                  onChangeText={handleChange('orgPostCode')}
                  onBlur={handleBlur('orgPostCode')}
                  value={values.orgPostCode}
                  placeholder='Postcode'
                />

                {errors.orgPostCode && submitPressed &&
                  <FormErrorText>{errors.orgPostCode}</FormErrorText>
                }

                <Input
                  onChangeText={handleChange('_360GivingId')}
                  onBlur={handleBlur('_360GivingId')}
                  value={values._360GivingId}
                  placeholder='360 Giving ID (Optional)'
                />

                <DropdownNoLabel
                  options={regionOptions}
                  selectedValue={region}
                  onValueChange={setRegion}
                  placeholder='Region'
                />

                <ErrorText>{serverMsg}</ErrorText>

                <Container>
                  <SubmitButton text="COMPLETE" onPress={()=>{setSubmitPressed(true);handleSubmit()}} />
                </Container>

                <PrintText>
                  By doing this you are agreeing to our&nbsp;
                    <LinkText onPress={() => props.navigation.navigate('TnC')}>
                    Terms and Conditions
                    </LinkText>
                </PrintText>

                <PrintText>
                  Already Registered? Log In&nbsp;
                    <LinkText onPress={() => props.navigation.navigate('Login')}>
                    Here
                    </LinkText>
                </PrintText>

              </Page>
            )
          }}
        </Formik>
      </KeyboardAvoidingView>

    );

  if (registrationType === "User")
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Formik
          initialValues={{ orgName: '', adminEmail: '', confirmEmail: '', adminName: '', orgPostCode: '', _360GivingId: '', name: '', email: '', password: '', phone: '', postCode: '', adminCode: '', region: '', birthYear: '' }}
          validationSchema={validationSchemaUser}
          onSubmit={async (values) => {
            try {
              //values of drop down
              values.region = region;
              values.YearOfBirth = userYearOfBirth;

              var volunteer_obj = {
                name: values.name,
                email: values.email,
                password: values.password,
                postCode: values.Postcode,
                phoneNumber: values.Phone,
                birthYear: parseInt(values.YearOfBirth),
                organisationId: userOrganisation.id
              }

              if (values.adminCode.length > 0) {
                volunteer_obj.role = "VOLUNTEER_ADMIN";
                volunteer_obj.adminCode = values.adminCode;
              } else {
                volunteer_obj.role = "VOLUNTEER";
              }

              //add volunteer
              const res = await API.Volunteers.add(volunteer_obj);

              if (res.status == 200) {
                setSuccessTextVisible(true);
                setTimeout(() => {
                  setSuccessTextVisible(false);
                  props.navigation.navigate('Login');
                }
                  , 700)
              }
            } catch (error) {
              console.log(error)
              setError(error.response.data.error.message);
            }
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

            <Page heading="Register">

              <SuccessText
                text="Registration Successful"
                visible={successTextVisible}
              />

              {registrationTypeDropdown}

              <Input
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder='Full Name'
              />
              {errors.name && submitPressed &&
                <FormErrorText>{errors.name}</FormErrorText>
              }

              <Input
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder='Email'
              />
              {errors.email && submitPressed &&
                <FormErrorText>{errors.email}</FormErrorText>
              }

              <Input
                onChangeText={handleChange('confirmEmail')}
                onBlur={handleBlur('confirmEmail')}
                value={values.confirmEmail}
                placeholder='Confirm Email'
                contextMenuHidden={true}
              />
              {errors.confirmEmail && submitPressed &&
                <FormErrorText>{errors.confirmEmail}</FormErrorText>
              }

              <Input
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder='Create Password'
              />
              {errors.password && 
                <FormErrorText>{errors.password}</FormErrorText>
              }

              <Input
                onChangeText={handleChange('postCode')}
                onBlur={handleBlur('postCode')}
                value={values.postCode}
                placeholder='Post Code'
              />
              {errors.postCode && submitPressed &&
                <FormErrorText>{errors.postCode}</FormErrorText>
              }

              <Input
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                placeholder='Phone Number (Optional)'
              />
              {errors.Phone && submitPressed &&
                <FormErrorText>{errors.phone}</FormErrorText>
              }

              <DropdownNoLabel
                options={yearOptions}
                selectedValue={userYearOfBirth}
                onValueChange={setUserYearOfBirth}
                placeholder='Year of Birth (Optional)'
              />

              <FuzzySearchBox
                label=""
                placeholder={"Search for your Organisation"}
                options={organisationOptions}
                selectedValue={userOrganisation}
                onValueChange={(org) => setUserOrganisation(org)}
                origin="register"
              />

              <Input
                onChangeText={handleChange('adminCode')}
                onBlur={handleBlur('adminCode')}
                value={values.adminCode}
                placeholder='Admin Access Code (Admin Required)'
              />
              <Container>
                <SubmitButton text="COMPLETE" onPress={()=>{setSubmitPressed(true);handleSubmit()}} />
              </Container>

              <FormErrorText>{serverError.toString()}</FormErrorText>

              <PrintText>
                By doing this you are agreeing to our&nbsp;
                <LinkText onPress={() => props.navigation.navigate('TnC')}>
                  Terms and Conditions
                </LinkText>
              </PrintText>

              <PrintText>
                Already Registered? Log In&nbsp;
              <LinkText onPress={() => props.navigation.navigate('Login')}>
                  Here
              </LinkText>
              </PrintText>


            </Page>

          )}
        </Formik>
      </KeyboardAvoidingView >
    );
}

export default Register;