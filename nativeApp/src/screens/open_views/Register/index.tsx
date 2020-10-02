import React, { useState, FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Picker, TextInput, View, Text, StyleSheet } from 'react-native';
import { Input as I } from 'native-base';
import DropdownShort from '../../../lib/ui/forms/DropdownShort';
import DropdownNoLabel from '../../../lib/ui/forms/DropdownNoLabel';
import FuzzySearchBox from '../../../lib/ui/forms/FuzzySearchBox';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import MessageModal from '../../../lib/ui/modals/MessageModal';

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


const formOptions = [{ id: 1, name: "Organisation" }, { id: 2, name: "User" }];
const yearOptions = [...Array(100).keys()].map((_, i) => ({ id: i, name: `${2005 - i}` }));
// const regionOptions = [{ id: 1, name: "East Midlands" }, { id: 2, name: "East of England" }, { id: 3, name: "London" }, { id: 4, name: "North East" }];
const regionOptions = [{ id: 1, name: "East Midlands" }, { id: 2, name: "East of England" }, { id: 3, name: "London" }, { id: 4, name: "North East" }, { id: 5, name: "North West" }, { id: 6, name: "South East" }, { id: 7, name: "South West" }, { id: 8, name: "West Midlands" }, { id: 9, name: "Yorkshire and The Humber" }];
const thankYouMessage = "\nThank you for registering!\nYou should have received\nan email with your admin code.\n\nPlease now register as a user\nand enter your admin code."
/*
 * Component
 */
const Register: FC<Props> = (props) => {
  const [registrationType, setRegistrationType] = useState("Organisation");
  const [organisationModalVisible, setOrganisationModalVisible] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [organisationOptions, setOrganisationOptions] = useState([{ id: 1, name: "loading organisations" }])

  const [successTextVisible, setSuccessTextVisible] = useState(false);

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
        console.log(listOfCommunityBusinesses);
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
    password: yup
      .string()
      .min(3, 'Please enter a password of at least 6 characters, including one digit (e.g. 1, 2, 3) and one symbol (e.g. !, ?, £)')
      .required('Please enter a password of at least 6 characters, including one digit (e.g. 1, 2, 3) and one symbol (e.g. !, ?, £)'),
    phone: yup
      .number(),
    adminCode: yup
      .string(),
    postCode: yup
      .string()
      .min(4)
      .max(10)
      .required()
  });

  if (registrationType === "Organisation")
    return (
      <Formik
        initialValues={{ orgName: '', adminEmail: '', adminName: '', orgPostCode: '', _360GivingId: '', name: '', email: '', password: '', phone: '', postCode: '', adminCode: '', region: '', birthYear: '' }}
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
          const res = await API.CommunityBusiness.register(orgObj);
          if (res.status == 200)
            setOrganisationModalVisible(true);
        }}>

        {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
          return (
            <Page heading="Register">

              <MessageModal
                isVisible={organisationModalVisible}
                message={thankYouMessage}
                onClose={() => { setOrganisationModalVisible(false); setRegistrationType("User"); }} />

              <Registration>
                <DropdownShort
                  options={formOptions} selectedValue={registrationType} onValueChange={setRegistrationType}
                />
              </Registration>

              <Input
                onChangeText={handleChange('orgName')}
                onBlur={handleBlur('orgName')}
                value={values.orgName}
                placeholder='Organisation Name'
              />
              {errors.orgName &&
                <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.orgName}</TextInput>
              }

              <Input
                onChangeText={handleChange('adminName')}
                onBlur={handleBlur('adminName')}
                value={values.adminName}
                placeholder='Admin Name'
              />
              {errors.orgName &&
                <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.adminName}</TextInput>
              }

              <Input
                onChangeText={handleChange('adminEmail')}
                onBlur={handleBlur('adminEmail')}
                value={values.adminEmail}
                placeholder='Organisation Email'
              />

              {errors.adminEmail &&
                <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.adminEmail}</TextInput>
              }

              <Input
                onChangeText={handleChange('orgPostCode')}
                onBlur={handleBlur('orgPostCode')}
                value={values.orgPostCode}
                placeholder='Postcode'
              />

              {errors.orgPostCode &&
                <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.orgPostCode}</TextInput>
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

              <Container>
                <SubmitButton text="COMPLETE" onPress={handleSubmit} />
              </Container>

              <PrintText>
                By doing this you are agreeing to our
                  <LinkText onPress={() => props.navigation.navigate('TnC')}>
                  Terms and Conditions
                  </LinkText>
              </PrintText>

              <PrintText>
                Already Registered? Log In
                  <LinkText onPress={() => props.navigation.navigate('Login')}>
                  Here
                  </LinkText>
              </PrintText>

            </Page>
          )
        }}
      </Formik>


    );

  if (registrationType === "User")
    return (

      <Formik
        validationSchema={validationSchemaUser}
        onSubmit={async (values) => {
          try {
            //values of drop down
            values.region = region;
            values.YearOfBirth = userYearOfBirth;

            if (values.adminCode.length > 0)
              values.role = "VOLUNTEER_ADMIN";
            else
              values.role = "VOLUNTEER";

            let volunteer_obj = {
              name: values.name,
              email: values.email,
              password: values.password,
              postCode: values.Postcode,
              phoneNumber: values.Phone,
              birthYear: parseInt(values.YearOfBirth),
              organisationId: userOrganisation.id,
              role: values.role
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

            <Registration>
              <DropdownShort
                options={formOptions} selectedValue={registrationType} onValueChange={setRegistrationType}
              />
            </Registration>

            <Input
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder='Full Name'
            />
            {errors.name &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.name}</TextInput>
            }

            <Input
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder='Email'
            />
            {errors.email &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.email}</TextInput>
            }

            <Input
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Create Password'
            />
            {errors.password &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.password}</TextInput>
            }

            <Input
              onChangeText={handleChange('postCode')}
              onBlur={handleBlur('postCode')}
              value={values.postCode}
              placeholder='Post Code'
            />
            {errors.postCode &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.postCode}</TextInput>
            }

            <Input
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              placeholder='Phone Number (Optional)'
            />
            {errors.Phone &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.phone}</TextInput>
            }

            <DropdownNoLabel
              options={yearOptions}
              selectedValue={userYearOfBirth}
              onValueChange={setUserYearOfBirth}
              placeholder='Year of Birth (Optional)'
            />

            <FuzzySearchBox
              label=""
              placeholder={"Find Organisation"}
              options={organisationOptions}
              selectedValue={userOrganisation}
              onValueChange={(org) => setUserOrganisation(org)}
              origin="register"
            />

            <Input
              onChangeText={handleChange('AdminCode')}
              onBlur={handleBlur('AdminCode')}
              value={values.adminCode}
              placeholder='Admin Access Code (Admin Required)'
            />
            <Container>
              <SubmitButton text="COMPLETE" onPress={handleSubmit} />
            </Container>

            <Text style={{ fontSize: 10, color: 'red' }}>{serverError.toString()}</Text>

            <PrintText>
              By doing this you are agreeing to our
                <LinkText onPress={() => props.navigation.navigate('TnC')}>
                Terms and Conditions
                </LinkText>
            </PrintText>

            <PrintText>
              Already Registered? Log In
              <LinkText onPress={() => props.navigation.navigate('Login')}>
                Here
              </LinkText>
            </PrintText>


          </Page>

        )}
      </Formik>
    );
}

export default Register;