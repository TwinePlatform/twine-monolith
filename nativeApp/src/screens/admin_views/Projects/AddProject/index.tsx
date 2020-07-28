import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';
import useForm from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NavigationInjectedProps } from 'react-navigation';
import Input from '../../../../lib/ui/forms/InputWithIcon';
import { Forms } from '../../../../lib/ui/forms/enums';
import SubmitButton from '../../../../lib/ui/forms/SubmitButton';
import Page from '../../../../lib/ui/Page';
import { createProject, selectCreateProjectStatus, createProjectReset } from '../../../../redux/entities/projects';
import { ErrorText } from '../../../../lib/ui/typography';

import { Formik } from 'formik';
import { Button } from 'react-native';
/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Form = styled(F)`
  width: ${Forms.formWidth}
`;

/*
* Constants
*/
const validationSchema = yup.object().shape({
  // yup.object().shape({
  name: yup
    .string()
    .required()
});

/*
 * Component
 */
const AddProject: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

  const dispatch = useDispatch();
  const [serverError, setError] = useState();

  const requestStatus = useSelector(selectCreateProjectStatus, shallowEqual);

  //   // TODO: modal to confirm save
  //   // TODO: response error handling
  useEffect(() => {
    console.log(requestStatus);
    if (requestStatus.success) {
      dispatch(createProjectReset());
      navigation.navigate('Projects');
    } else if (requestStatus.error !== null) {
      setError(requestStatus.error.message);
      console.log(serverError);
    }
  }, [requestStatus]);

  // const handleSubmit = (values, { dispatch }) => dispatch(createProject(values));

  return (
    <Formik
      initialValues={{ name: 'Project Name' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
        const res = dispatch(createProject(values.name));
        console.log(res);
      }}>

      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <Page heading="Add Project">
          <Input
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {(errors.name || serverError) &&
            <ErrorText>{errors.name || serverError}</ErrorText>
          }
          {/* <SubmitButton onPress={handleSubmit} title="Submit" /> */}
          <SubmitButton text="Submit" onPress={handleSubmit} />


        </Page>
      )}
    </Formik>
  )
};

export default AddProject;

