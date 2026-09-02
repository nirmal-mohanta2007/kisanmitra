export const FontSizes = {
  caption: 12,
  small: 14,
  body: 16,
  subtitle: 18,
  subheading: 18,
  title: 20,
  heading: 24,
  largeHeading: 28,
  hero: 32,
  header: 20,
  button: 16,
};

export const typography = {
  sizes: FontSizes,
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
};
