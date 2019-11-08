import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Select, SelectWrapper as _SelectWrapper, Option } from '../../../shared/components/form/base';


const SelectArrow = styled.div`
  float: right;
  margin-top: -1em;
  width: 0;
  pointer-events: none;
  border-width: 8px 5px 0 5px;
  border-style: solid;
  border-color: #7b7b7b transparent transparent transparent;
`;

const SelectWrapper = styled(_SelectWrapper)`
  margin-bottom: 0;
`;


const CategorySelector = ({ id, options, ...rest }) => (
  <SelectWrapper>
    <Select id={id} {...rest}>
      {
        options.map(opt => (
          <Option key={opt.key} value={opt.value}>
            {opt.content || opt.value}
          </Option>
        ))
      }
    </Select>
    <SelectArrow />
  </SelectWrapper>
);

export default CategorySelector;
