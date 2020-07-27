import React, { useState, FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Picker, TextInput, View, Text } from 'react-native';
import { Input as I } from 'native-base';
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

const formOptions = [{ id: 1, name: "Organisation" }, { id: 2, name: "User" }];
const yearOptions = [...Array(100).keys()].map((_, i) => ({ id: i, name: `${2005 - i}` }));
const genderOptions = [{ id: 1, name: "female" }, { id: 2, name: "male" }, { id: 3, name: "prefer not to say" }]

const thankYouMessage = "\nThank you for registering!\nYou should have received\nan email with your admin code.\n\nPlease now register as a user\nand enter your admin code."
/*
 * Component
 */
const Register: FC<Props> = (props) => {
  const [registrationType, setRegistrationType] = useState("Organisation");
  const [organisationModalVisible, setOrganisationModalVisible] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [organisationOptions, setOrganisationOptions] = useState([{ id: 1, name: "loading organisations" }])

  const [userYearOfBirth, setUserYearOfBirth] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userOrganisation, setUserOrganisation] = useState("");

  const [serverError, setError] = useState("");

  useEffect(() => {
    if (!initialised) {
      API.CommunityBusiness.get()
        .then(res => {
          console.log(res.data)
          //setOrganisationOptions(res.data)
        });
      setInitialised(true)
    }
  }

  );

  const validationSchemaOrg = yup.object().shape({
    OrgName: yup
      .string()
      .required(),
    OrgEmail: yup
      .string()
      .email()
      .required()
  });

  const validationSchemaUser = yup.object().shape({
    Name: yup
      .string()
      .required('Please enter your full name'),
    Email: yup
      .string()
      .email()
      .required('Please enter your email address. If you don’t have one, an administrator can help you register.'),
    Password: yup
      .string()
      .min(3, 'Please enter a password of at least 6 characters, including one digit (e.g. 1, 2, 3) and one symbol (e.g. !, ?, £)')
      .required('Please enter a password of at least 6 characters, including one digit (e.g. 1, 2, 3) and one symbol (e.g. !, ?, £)'),
    Phone: yup
      .number()
      .required('Please enter your phone number. If you don’t have one, an administrator can help you register.'),
    AdminCode: yup
      .string()
      .required()
  });

  const onSubmit = () => {
    if (registrationType === "User")
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
      });*/ {


    }
    if (registrationType === "Organisation") {
      /*API.CommunityBusiness.add({

      });
      toggleOrgModal();*/
      console.log("name: " + organisationName + "\n" + "email: " + organisationEmail);
      setOrganisationModalVisible(true);
    }

  }

  if (registrationType === "Organisation")
    return (
      <Formik
        initialValues={{ OrgName: 'Organisation Name', OrgEmail: 'Organisation Email', Name: 'Name', Email: 'Email@gmail.com', Password: 'Password', Phone: '555', Postcode: 'Postcode (Optional)', AdminCode: 'AdminCode' }}
        validationSchema={validationSchemaOrg}
        onSubmit={(values) => {
          // console.log(values);
          // const res = dispatch(createProject(values.name));
          // console.log(res);
        }}>

        {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
          return (
            <Page heading="Register">

              <MessageModal
                isVisible={organisationModalVisible}
                message={thankYouMessage}
                onClose={() => { setOrganisationModalVisible(false); setRegistrationType("User"); }} />
              <DropdownNoLabel
                options={formOptions} selectedValue={registrationType} onValueChange={setRegistrationType}
              />

              <Input
                onChangeText={handleChange('OrgName')}
                onBlur={handleBlur('OrgName')}
                value={values.OrgName}
              />
              {errors.OrgName &&
                <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.OrgName}</TextInput>
              }

              <Input
                onChangeText={handleChange('OrgEmail')}
                onBlur={handleBlur('OrgEmail')}
                value={values.OrgEmail}
              />

              {errors.OrgEmail &&
                <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.OrgEmail}</TextInput>
              }

              <SubmitButton onPress={handleSubmit} text="Complete" />

              <LinkText onPress={() => props.navigation.navigate('TnC')}>
                Terms and Conditions
            </LinkText>
              <LinkText onPress={() => props.navigation.navigate('Login')}>
                Already Registered? Log In Here
            </LinkText>
            </Page>
          )
        }}
      </Formik>


    );

  if (registrationType === "User")
    return (

      <Formik
        validationSchema={validationSchemaUser}
        onSubmit={async () => {
          try {
            const res = await API.Volunteers.add({
              "organisationId": "2",
              "role": "VOLUNTEER",
              "name": "userName",
              "gender": "prefer not to say",
              "email": "1@aperturescience.com",
              "password": "Password123!?"
            });
          } catch (error) {
            setError(error.response.data.error.message);

          }
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

          <Page heading="Register">
            <DropdownNoLabel
              options={formOptions} selectedValue={registrationType} onValueChange={setRegistrationType}
            />

            <Input
              onChangeText={handleChange('Name')}
              onBlur={handleBlur('Name')}
              value={values.Name}
            />
            {errors.Name &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.Name}</TextInput>
            }

            <Input
              onChangeText={handleChange('Email')}
              onBlur={handleBlur('Email')}
              value={values.Email}
            />
            {errors.Email &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.Email}</TextInput>
            }

            <Input
              onChangeText={handleChange('Password')}
              onBlur={handleBlur('Password')}
              value={values.Password}
            />
            {errors.Password &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.Password}</TextInput>
            }

            <Input
              onChangeText={handleChange('Phone')}
              onBlur={handleBlur('Phone')}
              value={values.Phone}
            />
            {errors.Phone &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.Phone}</TextInput>
            }

            <Input
              onChangeText={handleChange('Postcode')}
              onBlur={handleBlur('Postcode')}
              value={values.Postcode}
            />
            {errors.Postcode &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.Postcode}</TextInput>
            }

            <DropdownNoLabel
              options={yearOptions} selectedValue={userYearOfBirth} onValueChange={setUserYearOfBirth}
            />

            <DropdownNoLabel
              options={genderOptions} selectedValue={userGender} onValueChange={setUserGender}
            />

            <FuzzySearchBox label="" placeholder={"Find Organisation"} options={organisationOptions} selectedValue={userOrganisation} onValueChange={setUserOrganisation} />

            <Input
              onChangeText={handleChange('AdminCode')}
              onBlur={handleBlur('AdminCode')}
              value={values.AdminCode}
            />
            {errors.AdminCode &&
              <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.AdminCode}</TextInput>
            }

            <SubmitButton text="COMPLETE" onPress={handleSubmit} />
            <Text>{serverError.toString()}</Text>
            <LinkText onPress={() => props.navigation.navigate('TnC')}>
              Terms and Conditions
          </LinkText>
            <LinkText onPress={() => props.navigation.navigate('Login')}>
              Already Registered
          </LinkText>

          </Page>

        )}
      </Formik>
    );
}

export default Register;