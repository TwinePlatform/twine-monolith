import { css, BaseThemedCssFunction } from 'styled-components';
import { Dictionary } from 'ramda';

/*
 * Style guide
 */

export enum ColoursEnum {
  white = '#FFFFFF',
  offWhite = '#F8F8F8',
  grey = '#707070',
  primary = '#8000FF',
}

export const colors = {
  highlight_primary: '#FDBD2D',
  highlight_secondary: '#833FF7',
  hover_primary: '#DE9B06',
  hover_secondary: '#6717F3',
  darker: '#424242',
  dark: '#666666',
  light: '#DBDBDB',
  lighter: '#FFFFFF',
  background: '#FFFFFF',
  error: '#FF4848',
  white: '#FFF',
  black: '#000',
};

export enum FontSizeEnum {
  heading = '1.6em',
  heading2 = '1.2em',
  medium = '0.8em',
  small = '0.65em',
}

export enum SpacingEnum {
  xSmall = '0.5em',
  small = '1em',
  medium = '2em',
  large = '4em',
}
export const fonts = {
  family: {
    default: 'Roboto, sans-serif',
    highlight: 'Roboto, sans-serif',
  },
  size: {
    base: '1rem',
    heading: '1.6rem',
    heading2: '1.2rem',
    medium: '0.8rem',
    small: '0.65rem',
  },
  weight: {
    base: '400',
    light: '300',
    medium: '700',
    heavy: '800',
  },
};

export default {
  colors,
  fonts,
  fontFamily: fonts.family,
  fontSize: fonts.size,
  fontWeight: fonts.weight,
};

export enum DisplayWidthEnum {
  small = '@media (max-width: 600px)',
  medium = '@media (max-width: 1024px)',
  large = '@media (max-width: 1440px)',
  xlarge = '@media (max-width: 1920px)',
}
