/*
 * Labelled Select component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, SelectWrapper, Option, Label } from './base';
import { colors } from '../../style_guide';

const ErrorText = styled.span`
color: ${colors.error};
display: ${props => (props.show ? 'inline' : 'none')};
`;

const LabelledSelectContainer = styled.div`
  width: 100%;
`;

const SelectArrow = styled.div`
  float: right;
  margin-top: -1em;
  width: 0;
  pointer-events: none;
  border-width: 8px 5px 0 5px;
  border-style: solid;
  border-color: #7b7b7b transparent transparent transparent;
`;

const LabelledSelect = ({ id, label, options, error, ...rest }) => (
  <LabelledSelectContainer>
    <Label htmlFor={id}>{label}</Label>
    <ErrorText show={error}>{error}</ErrorText>
    <SelectWrapper>
      <Select id={id} {...rest}>
        {options.map(opt => (
          <Option key={opt.key} value={opt.value}>
            {opt.content || opt.value}
          </Option>
        ))}
      </Select>
      <SelectArrow />
    </SelectWrapper>
  </LabelledSelectContainer>
);

LabelledSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired,
      content: PropTypes.string,
    }),
  ).isRequired,
};

LabelledSelect.defaultProps = {
  error: null,
};

export default LabelledSelect;
