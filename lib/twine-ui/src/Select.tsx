import React from 'react';
import styled from 'styled-components';
import { Span, Text } from './Typography'
import { ColoursEnum, Fonts } from './styles';


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: (React.OptionHTMLAttributes<HTMLOptionElement> & { key: string })[]
  error?: string
  inline?: boolean
}

const Label = styled.label`
  width: 100%;
  margin-bottom: 0.2em;
  color: ${ColoursEnum.black};
  font-size: ${Fonts.size.body};
`;

const Container = styled.div`
  width: 100%;
`;

const SelectArrow = styled.div`
  float: right;
  margin-top: -1em;
  width: 0;
  pointer-events: none;
  border-width: 8px 5px 0 5px;
  border-style: solid;
  border-color: ${ColoursEnum.darkGrey} transparent transparent transparent;
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
  margin-bottom: 1em;
  padding: 0.6em;
  border: 0.1em solid ${ColoursEnum.lightGrey};
  border-radius: 0.15em;
  overflow: hidden;
  background-color: ${ColoursEnum.white};

  &:focus-within {
    border: 0.1em solid ${ColoursEnum.orange};
  }
`;

export const Option = styled.option`
  font: ${Fonts.family.main};
  font-size: ${Fonts.size.base};
`;

const LabelContent = styled(Text)`
  width: 100%;
  text-align: left;
  margin-bottom: 0 0 0.5em 0;
  ${(props: { inline?: boolean }) => props.inline && 'display: inline;'}
`;

const ErrorText = styled(Span)`
  color: red;
`;


const LabelledSelect: React.FunctionComponent<SelectProps> = (props) => {
  const { label, options, error, inline = false, } = props;

  return (
    <Container>
      <Label>
        <LabelContent inline={inline}>{label}</LabelContent>
      </Label>
      <SelectWrapper>
        <Select>
          {
            options.map((o) => (
              <Option key={o.key} value={o.value}>
                {o.label || o.value}
              </Option>
            ))
          }
        </Select>
        <SelectArrow />
      </SelectWrapper>
      { error && <ErrorText>{error}</ErrorText> }
    </Container>
  )
};

export default LabelledSelect;
