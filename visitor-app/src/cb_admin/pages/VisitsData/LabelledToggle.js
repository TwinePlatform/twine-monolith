import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Toggle from './Toggle';
import { Label } from '../../../shared/components/form/base';


const Container = styled.div`
  margin-bottom: 1rem;
`;


const LabelledToggle = ({ id, label, ...props }) => (
  <Container>
    <Label htmlFor={id}>{label}</Label>
    <Toggle id={id} {...props} />
  </Container>
);

LabelledToggle.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default LabelledToggle;
