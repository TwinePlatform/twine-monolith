/*
 * Custom checkbox
 *
 * (probably) adapted from:
 * https://medium.com/@colebemis/building-a-checkbox-component-with-react-and-styled-components-8d3aa1d826dd
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../style_guide';
import { Paragraph } from '../text/base';


const CheckboxDiv = styled.div`
  margin-bottom: 0.5em;
  display: flex;
  align-items: center;

  & input {
    cursor: pointer;
    z-index: -1;
    opacity: 0;
    position: absolute;
  }

  & input + label::before {
    cursor: pointer;
    content: '';
    display: inline-block;
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    border: 0.2em solid ${colors.highlight_primary};
    background: transparent;
    position: relative;
    transition: all 0.3s;
  }

  & input:checked + label::before {
    background: ${colors.highlight_primary};
  }

  & input + label {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & p {
      margin: 0.5rem;
      max-width: 85%;
    }
  }
`;
const Input = styled.input``;
const Label = styled.label``;
const Text = styled(Paragraph)`
  padding-left: 1rem;
`;

const Checkbox = ({ id, onChange, label, className, ...props }) => (
  <CheckboxDiv className={className}>
    <Input id={id} type="checkbox" onChange={onChange} {...props} />
    <Label htmlFor={id} />
    {
      label && <Text>{label}</Text>
    }
  </CheckboxDiv>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  onChange: () => {},
  label: '',
  className: '',
};

export default Checkbox;
