import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      textLight: string;
      white: string;
      success: string;
      error: string;
      gold: string;
      mbti: {
        E: string;
        I: string;
        S: string;
        N: string;
        T: string;
        F: string;
        J: string;
        P: string;
      }
    };
    fonts: {
      main: string;
      heading: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    shadows: {
      card: string;
      hover: string;
      soft: string;
      depth1: string;
      depth2: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      round: string;
    };
    spacing: (n: number) => string;
    zIndex: {
      base: number;
      elevated: number;
      modal: number;
    };
    transitions: {
      default: string;
      slow: string;
    };
  }
}
