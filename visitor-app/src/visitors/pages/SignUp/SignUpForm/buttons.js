import React from 'react';
import styled from 'styled-components';
import { BounceLoader } from 'react-spinners';
import { PrimaryButton } from '../../../../shared/components/form/base';
import { colors } from '../../../../shared/style_guide';
/*
 * Styles
 */

const Button = styled(PrimaryButton)`
  height: 4em;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Span = styled.span`
  flex: ${(props => props.flex || 1)};
`;

export const SubmitButton = () =>
  (<Button type="submit">
    CONTINUE
  </Button>);


export const DisabledButton = () => (
  <Button type="submit" disabled >
    <Span flex={1} />
    <Span flex={2}>CONTINUE</Span>
    <Span flex={1}>
      <BounceLoader size={20} color={colors.highlight_primary} />
    </Span>
  </Button>);
