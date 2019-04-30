import React from 'react';
import styled from 'styled-components';
import { Span, Text } from './Typography'
import { ColoursEnum, Fonts } from './styles';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputContainer = styled.div`
  margin-bottom: 1em;
`;

const Label = styled.label`
  width: 100%;
  margin-bottom: 0.2em;
  color: ${ColoursEnum.black};
  font-size: ${Fonts.size.body};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875em;
  border: 0.125em solid ${(props: { error?: string }) => props.error ? 'red' : ColoursEnum.grey};
  border-radius: 0.25em;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.black};
  background-color: ${ColoursEnum.white};
  font-size: ${Fonts.size.body};

  &:focus {
    border-color: ${ColoursEnum.orange};
  }
`;

const LabelContent = styled(Text)`
  width: 100%;
  text-align: left;
  margin-bottom: 0 0 0.5em 0;
`;

const ErrorText = styled(Text)`
  color: red;
  margin-top: 0.65em;
`;

/**
 * Input element
 */
const LabelledInput: React.FunctionComponent<InputProps> = (props) => {
  const { label, error, ...rest } = props;

  if (label) {
    return (
      <InputContainer>
        <Label>
          <LabelContent>
            { label }
          </LabelContent>
          <Input {...rest} error />
        </Label>
        { error && <ErrorText>{error}</ErrorText> }
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <Input {...rest} />
      { error && <ErrorText>{error}</ErrorText> }
    </InputContainer>
  );
};

export default LabelledInput;
