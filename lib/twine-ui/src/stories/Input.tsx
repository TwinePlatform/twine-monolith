import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import Input from '../components/Input';

const Container = styled.div`
  width: 480px;
`;

storiesOf('Input', module)
  .add('with no label', () => (
    <Container>
      <Input type="text" />
    </Container>
  ))
  .add('with label', () => (
    <Container>
      <Input type="text" label="Name" />
    </Container>
  ))
  .add('with label & error', () => (
    <Container>
      <Input type="text" label="Name" error="oopsy" />
    </Container>
  ));
