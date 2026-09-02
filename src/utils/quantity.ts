export const kgToQuintal = (kg: number): number => {
  return kg / 100;
};

export const quintalToKg = (quintal: number): number => {
  return quintal * 100;
};

export const formatQuantity = (quintals: number): string => {
  return `${quintals.toFixed(2)} Qtl`;
};
