import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#FF7F7F', // Warm Coral - User requested
    secondary: '#98D8C8', // Mint Green - User requested
    accent: '#F4A261', // Warm Orange
    gold: '#D4AF37', // Gold for achievements
    background: '#FDF8F3', // Warm Beige
    text: '#2D3748', // Dark Grey
    textLight: '#718096', // Medium Grey
    white: '#FFFFFF',
    success: '#98D8C8', // Mint Green for success
    error: '#FC8181', // Soft Red
    mbti: {
      E: '#FF7F7F',
      I: '#98D8C8',
      S: '#F4A261',
      N: '#81E6D9',
      T: '#90CDF4',
      F: '#FBB6CE',
      J: '#D6BCFA',
      P: '#FAF089'
    }
  },
  fonts: {
    main: "'Noto Sans SC', 'Inter', 'Helvetica Neue', Arial, sans-serif",
    heading: "'Noto Sans SC', sans-serif"
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  },
  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.05)', // Soft multi-layer shadow
    hover: '0 10px 25px rgba(0, 0, 0, 0.08)',
    soft: '0 2px 10px rgba(0, 0, 0, 0.02)',
    depth1: '0 2px 4px rgba(0, 0, 0, 0.04)',
    depth2: '0 4px 8px rgba(0, 0, 0, 0.06)'
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
    round: '999px'
  },
  spacing: (n: number) => `${n * 8}px`,
  zIndex: {
    base: 10,
    elevated: 20,
    modal: 1000
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
