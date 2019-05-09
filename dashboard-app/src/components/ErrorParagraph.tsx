import React from 'react';
import styled from 'styled-components';
import { toPairs, Dictionary } from 'ramda';

import { ColoursEnum, SpacingEnum } from '../styles/style_guide';

export const ErrorParagraph = styled.p`
  min-height: 2rem;
  padding: ${SpacingEnum.xSmall} 0;
  color: ${ColoursEnum.red};
`;

export const displayErrors = (errors: Dictionary<string>) =>
  (<ErrorParagraph>{toPairs(errors).map((x: any) => x.join(': ')) || ''}</ErrorParagraph>);
