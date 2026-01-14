export const COLORS = {
  background: '#000000',
  primary: '#9ACD32', // Gold
  accent: '#1E90FF', // Blue
  danger: '#FF0000', // Red
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#333333',
  cardBackground: '#1A1A1A',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    color: COLORS.text,
  },
  caption: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
};
