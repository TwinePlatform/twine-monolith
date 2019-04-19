import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';
import { FontSizeEnum, ColoursEnum } from '../styles/style_guide';


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
  color: ${ColoursEnum.font};
  font-size: ${FontSizeEnum.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 0.1rem solid ${ColoursEnum.light};
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.font};
  background-color: ${ColoursEnum.white};
  font-size: ${FontSizeEnum.medium};

  &:focus {
    border: 0.1rem solid ${ColoursEnum.primary};
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
const LabelledInput: SFC<InputProps> = (props) => {
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
