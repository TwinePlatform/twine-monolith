import styled from 'styled-components';
import { rgba } from 'polished';
import { ColoursEnum, Fonts } from '../styles/design_system';


export const Button = styled.button`
  border: none;
  border-radius: 0.3rem;
  outline: none;
  box-shadow: none;
  color: ${ColoursEnum.white};
  font-size: ${Fonts.size.emphasis};
  padding: 0.75em 1em;
  cursor: pointer;
`;

export const AccessibilityButton = styled.button`
  margin: 0;
  padding: 0;
  width: 100%;
  background: inherit;
  border: none;
  outline: none;
  box-shadow: none;
  cursor: pointer;
`;

export const PrimaryButton = styled(Button)`
  background-color: ${ColoursEnum.purple};
  transition: background-color ease 0.3s;

  &:hover {
    background-color: ${rgba(ColoursEnum.purple, 0.8)};
  };

  &:active {
    background-color: ${rgba(ColoursEnum.purple, 0.6)};
  }
`;

export const SubmitButton = styled(PrimaryButton)`
  width: 50%;
`;

export const RoundedButton = styled(PrimaryButton)`
  width: 9rem;
  border-radius: 2rem;

  &:disabled, &[disabled] {
    background-color: ${ColoursEnum.grey};
  }
`;


export const DownloadButton = styled(Button)`
  font-size: ${Fonts.size.body};
  padding: 0em 1em;
  margin: 0 1rem;
  background-color: ${ColoursEnum.darkGrey};
  transition: background-color ease 0.3s;

  &:hover {
    background-color: ${ColoursEnum.grey};
  };

  &:active {
    background-color: ${ColoursEnum.grey};
  }
`;

