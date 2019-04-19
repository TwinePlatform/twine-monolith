import styled from 'styled-components';
import { rgba } from 'polished';
import { ColoursEnum, FontSizeEnum } from '../styles/style_guide';


export const Button = styled.button`
  border: none;
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.white};
  font-size: ${FontSizeEnum.medium};
`;

export const PrimaryButton = styled(Button)`
  background-color: ${ColoursEnum.primary};

  &:hover {
    background: linear-gradient(
      0,
      ${rgba(ColoursEnum.darkPrimary, 0.75)} 0%,
      ${ColoursEnum.darkPrimary} 100%
    );
  };
`;

export const SubmitButton = styled(PrimaryButton)`
  width: 50%;
  padding: 1rem;
`;
