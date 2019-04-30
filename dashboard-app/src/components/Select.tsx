import React from 'react';
import styled from 'styled-components';
import { ColoursEnum, Fonts } from '../styles/style_guide';
import Label from './Label';


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, SelectContainerProps {
  options: (React.OptionHTMLAttributes<HTMLOptionElement> & { key: string })[];
}

interface SelectContainerProps {
  label: string;
  inline?: boolean;
  error?: string;
}

const Container = styled.div`
  width: 100%;
`;

const SelectArrow = styled.div`
  float: right;
  margin-top: -0.8em;
  width: 0;
  pointer-events: none;
  border-width: 8px 5px 0 5px;
  border-style: solid;
  border-color: ${ColoursEnum.grey} transparent transparent transparent;
`;


export const Select = styled.select`
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  box-shadow: none;
  -ms-progress-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  color: ${ColoursEnum.grey};
`;

export const SelectWrapper = styled.div`
  width: 100%;
  padding: 0.6em;
  border: 0.1em solid ${ColoursEnum.light};
  border-radius: 0.15em;
  overflow: hidden;
  background-color: ${ColoursEnum.white};

  &:focus-within {
    border: 0.1em solid ${ColoursEnum.orange};
  }
`;

export const Option = styled.option`
  font: ${Fonts.family.default};
  font-size: ${Fonts.size.normal};
`;

const ErrorText = styled.span`
  color: red;
`;

export const SelectContainer: React.FunctionComponent<SelectContainerProps> = (props) => {
  const { label, error, inline = false, children } = props;

  return (
    <Container>
      <Label inline={inline} content={label}>
        <SelectWrapper>
          { children }
          <SelectArrow />
        </SelectWrapper>
      </Label>
      { error && <ErrorText>{error}</ErrorText> }
    </Container>
  );
}


const LabelledSelect: React.FunctionComponent<SelectProps> = (props) => {
  const { label, options, error, inline = false, ...rest } = props;

  return (
    <SelectContainer {...props}>
      <Select {...rest}>
        {
          options.map((o) => (
            <Option key={o.key} value={o.value}>
              {o.label || o.value}
            </Option>
          ))
        }
      </Select>
    </SelectContainer>
  );
};

export default LabelledSelect;
