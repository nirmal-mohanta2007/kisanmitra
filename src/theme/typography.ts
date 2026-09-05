export const FontSizes = {
  caption: 14,
  small: 16,
  body: 17.5,
  subtitle: 19,
  subheading: 19,
  title: 21,
  heading: 25,
  largeHeading: 29,
  hero: 34,
  header: 22,
  button: 17.5,
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
