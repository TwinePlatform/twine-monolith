import styled from 'styled-components';
import { rgba } from 'polished';
import { colors, fonts, ColoursEnum } from '../styles/style_guide';


export const Button = styled.button`
  border: none;
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.white};
  font-size: ${fonts.size.medium};
`;

export const PrimaryButton = styled(Button)`
  background-color: ${ColoursEnum.primary};

  &:hover {
    background: linear-gradient(
      0,
      ${rgba(colors.hover_primary, 0.75)} 0%,
      ${colors.hover_primary} 100%
    );
  };
`;

export const SubmitButton = styled(PrimaryButton)`
  width: 50%;
  padding: 1rem;
`;
