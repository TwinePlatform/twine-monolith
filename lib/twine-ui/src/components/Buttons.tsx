import styled from 'styled-components';
import { rgba } from 'polished';
import { ColoursEnum, Fonts } from '../styles';


export const Button = styled.button`
  /* Base styles */
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  font-size: ${Fonts.size.body};
  border: none;
  border-radius: 0.3125em;
  outline: none;
  box-shadow: none;

  /* Standard styles */
  background-color: ${ColoursEnum.purple};
  color: ${ColoursEnum.white};
  padding: 0.75em 2em;

  /* Hover styles */
  &:hover {
    background-color: ${rgba(ColoursEnum.purple, 0.8)};
  }

  /* Pressed styles */
  &:active {
    background-color: ${rgba(ColoursEnum.purple, 0.6)};
  }
`;

export const CancelButton = styled(Button)`
  /* Base styles */
  border: 0.125em solid ${ColoursEnum.purple};

  /* Standard styles */
  background-color: ${ColoursEnum.white};
  color: ${ColoursEnum.black};

  /* Hover styles */
  &:hover {
    background-color: ${ColoursEnum.white};
  }

  /* Pressed styles */
  &:active {
    background-color: ${ColoursEnum.white};
  }
`;

export const BigButton = styled(Button)`
  /* Base styles */
  border-radius: 2em;

  /* Standard styles */
  padding: 1em 6em;
`;
