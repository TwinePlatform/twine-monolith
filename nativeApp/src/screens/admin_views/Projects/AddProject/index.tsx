import React, { FC, useEffect } from 'react';
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

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 lettters')
    .max(30, 'Name cannot be longer than 30 letters'),
  // .matches({
  // regex: /^[a-zA-Z]{2,}\s?[a-zA-z]*['-]?[a-zA-Z]*['\- ]?([a-zA-Z]{1,})?/,
  // message: 'Name must not contain special characters' })
});

/*
 * Component
 */
const AddProject: FC<Props & NavigationInjectedProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    register, setValue, handleSubmit, errors, triggerValidation,
  } = useForm<FormData>({ validationSchema });

  const requestStatus = useSelector(selectCreateProjectStatus, shallowEqual);

  // TODO: modal to confirm save
  // TODO: response error handling
  useEffect(() => {
    if (requestStatus.success) {
      dispatch(createProjectReset());
      navigation.navigate('Projects');
    }
  }, [requestStatus]);

  const onSubmit = ({ name }: { name: string }) => {
    dispatch(createProject(name));
  };

  return (
    <Page heading="Add Project">
      <Form>
        <Input
          ref={register({ name: 'name' })}
          label="Project"
          onChangeText={(text) => setValue('name', text)}
          onBlur={async () => triggerValidation()}
          error={Boolean(errors.name)}
        />

        <SubmitButton text="SAVE" onPress={handleSubmit(onSubmit)} />
        {Object.keys(errors).map((key) => (<ErrorText key={key}>{errors[key]}</ErrorText>))}
      </Form>
    </Page>
  );
};

export default AddProject;
