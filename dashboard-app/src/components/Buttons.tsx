import styled from 'styled-components';
import { rgba } from 'polished';
import { colors, fonts } from '../styles/style_guide';


export const Button = styled.button`
  border: none;
  border-radius: 0.15rem;
  outline: none;
  box-shadow: none;
  color: ${colors.black};
  letter-spacing: 0.2rem;
  font-size: ${fonts.size.medium};
`;

export const PrimaryButton = styled(Button)`
  background-color: ${colors.highlight_primary}; /* Fallback */
  background: linear-gradient(
    0,
    ${rgba(colors.highlight_primary, 0.75)} 0%,
    ${colors.highlight_primary} 100%
  );

  &:hover {
    background: linear-gradient(
      0,
      ${rgba(colors.hover_primary, 0.75)} 0%,
      ${colors.hover_primary} 100%
    );
  }
`;

export const SubmitButton = styled(PrimaryButton)`
  width: 100%;
  padding: 1rem;
`;
