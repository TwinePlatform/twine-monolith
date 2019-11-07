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

export const colourPalette = {
  muted: {
    red: '#E36860',
    pink: '#EF7CA3',
    violet: '#9C78D9',
    purple: '#6370BC',
    blue: '#47ABFA',
    emerald: '#379A90',
    green: '#6DB26F',
    lime: '#D7E360',
    sunrise: '#FDAF3A',
    orange: '#FC855F',
    brown: '#8B7972',
    grey: '#9CAEB5',
  },
  vibrant: {
    red: '#D32F2F',
    pink: '#C2185B',
    voilet: '#512DA8',
    purple: '#651FFF',
    blue: '#1565C0',
    emerald: '#00695C',
    green: '#2E7D32',
    lime: '#AFB42B',
    sunrise: '#E65100',
    orange: '#BF360C',
    brown: '#5D4037',
    grey: '#757575',
  },
};

export const colourList = {
  muted: [
    '#E36860',
    '#EF7CA3',
    '#9C78D9',
    '#6370BC',
    '#47ABFA',
    '#379A90',
    '#6DB26F',
    '#D7E360',
    '#FDAF3A',
    '#FC855F',
    '#8B7972',
    '#9CAEB5',
  ],
  vibrant: [
    '#D32F2F',
    '#C2185B',
    '#512DA8',
    '#651FFF',
    '#1565C0',
    '#00695C',
    '#2E7D32',
    '#AFB42B',
    '#E65100',
    '#BF360C',
    '#5D4037',
    '#757575',
  ],
};


export const fonts = {
  family: {
    default: 'Nunito, sans-serif',
    highlight: 'Nunito, sans-serif',
  },
  size: {
    base: '1em',
    heading: '2em',
    heading2: '1.5em',
    small: '0.65em',
  },
  weight: {
    base: '400',
    light: '300',
    medium: '700',
    heavy: '800',
  },
};


export const layout = {};


export default {
  colors,
  fonts,
  layout,
  fontFamily: fonts.family,
  fontSize: fonts.size,
  fontWeight: fonts.weight,
};
