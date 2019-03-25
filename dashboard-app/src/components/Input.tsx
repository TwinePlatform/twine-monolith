import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';
import { colors, fonts } from '../styles/style_guide';


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
  color: ${colors.dark};
  font: ${fonts.family.default};
  font-size: ${fonts.size.base};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 0.1rem solid ${colors.light};
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${colors.dark};
  background-color: ${rgba(colors.highlight_primary, 0.06)};
  font-size: ${fonts.size.base};

  &:focus {
    border: 0.1rem solid ${colors.highlight_primary};
  }
`;

const LabelContent = styled.p`
  width: 100%;
  text-align: left;
  margin: 0;
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
