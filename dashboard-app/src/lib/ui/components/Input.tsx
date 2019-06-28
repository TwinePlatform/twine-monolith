import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Fonts, ColoursEnum } from '../design_system';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label<{ display: string }>`
  display: ${(props) => (props.display || 'block')};
  width: 100%;
  margin-bottom: 0.2rem;
  color: ${ColoursEnum.black};
  font-size: ${Fonts.size.body};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 0.1rem solid ${ColoursEnum.grey};
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.black};
  background-color: ${ColoursEnum.white};
  font-size: ${Fonts.size.body};

  &:focus {
    border: 0.1rem solid ${ColoursEnum.orange};
  }
`;

const LabelContent = styled.p`
  width: 100%;
  text-align: left;
  margin: 0;
  margin-bottom: 0.5em;
`;

const ErrorText = styled.span`
  color: red;
`;

/**
 * Input element
 */
const LabelledInput: FunctionComponent<InputProps> = (props) => {
  const { label, error, ...rest } = props;

  if (label) {
    return (
      <InputContainer>
        <Label display="inline">
          <LabelContent>
            { label }
            { error ? ' ' : null }
            { error ? <ErrorText>{error}</ErrorText> : null }
          </LabelContent>
          <Input {...rest} />
        </Label>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      { error && <ErrorText>{error}</ErrorText> }
      <Input {...rest} />
    </InputContainer>
  );
};

LabelledInput.propTypes = {
  /**
   * Label for the input element (optional)
   */
  label: PropTypes.string,
  error: PropTypes.string,
};

LabelledInput.defaultProps = {
  label: '',
  error: '',
};

export default LabelledInput;
