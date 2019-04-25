import styled from 'styled-components';
import { ColoursEnum, FontSizeEnum } from '../styles/style_guide';


export const Button = styled.button`
  border: none;
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.white};
  font-size: ${FontSizeEnum.normal};
  padding: 0.75em 1em;
`;

export const PrimaryButton = styled(Button)`
  background-color: ${ColoursEnum.primary};
  transition: background-color ease 0.3s;

  &:hover {
    background-color: ${ColoursEnum.darkPrimary}
  };
`;

export const SubmitButton = styled(PrimaryButton)`
  width: 50%;
`;
