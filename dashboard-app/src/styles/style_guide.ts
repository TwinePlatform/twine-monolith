/*
 * Style guide
 */

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

export const fonts = {
  family: {
    default: 'Nunito, sans-serif',
    highlight: 'Nunito, sans-serif',
  },
  size: {
    base: '1rem',
    heading: '2rem',
    heading2: '1.5rem',
    medium: '1rem',
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
