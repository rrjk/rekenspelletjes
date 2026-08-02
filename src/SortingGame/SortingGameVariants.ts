export type BoxColor = 'red' | 'blue' | 'purple';

interface SortingGameVariantInfo {
  numberBoxes: 2 | 3 | 4;
  minimumValue: number;
  maximumValue: number;
  divider: number;
  boxColor: BoxColor;
}

const defaultVariant: SortingGameVariantInfo = {
  numberBoxes: 4,
  minimumValue: 1,
  maximumValue: 10,
  divider: 1,
  boxColor: 'red',
};

// Export for testing
export const sortingGameVariants: Record<string, SortingGameVariantInfo> = {
  // Section A: Numbers 1-10 (red boxes)
  aa: {
    numberBoxes: 2,
    minimumValue: 1,
    maximumValue: 10,
    divider: 1,
    boxColor: 'red',
  },
  ab: {
    numberBoxes: 3,
    minimumValue: 1,
    maximumValue: 10,
    divider: 1,
    boxColor: 'red',
  },
  ac: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 10,
    divider: 1,
    boxColor: 'red',
  },

  // Section B: Numbers 1-30 (red boxes)
  ba: {
    numberBoxes: 2,
    minimumValue: 1,
    maximumValue: 30,
    divider: 1,
    boxColor: 'red',
  },
  bb: {
    numberBoxes: 3,
    minimumValue: 1,
    maximumValue: 30,
    divider: 1,
    boxColor: 'red',
  },
  bc: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 30,
    divider: 1,
    boxColor: 'red',
  },

  // Section C: Numbers 1-50 (red boxes)
  ca: {
    numberBoxes: 2,
    minimumValue: 1,
    maximumValue: 50,
    divider: 1,
    boxColor: 'red',
  },
  cb: {
    numberBoxes: 3,
    minimumValue: 1,
    maximumValue: 50,
    divider: 1,
    boxColor: 'red',
  },
  cc: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 50,
    divider: 1,
    boxColor: 'red',
  },

  // Section D: Numbers 1-100 (red boxes)
  da: {
    numberBoxes: 2,
    minimumValue: 1,
    maximumValue: 100,
    divider: 1,
    boxColor: 'red',
  },
  db: {
    numberBoxes: 3,
    minimumValue: 1,
    maximumValue: 100,
    divider: 1,
    boxColor: 'red',
  },
  dc: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 100,
    divider: 1,
    boxColor: 'red',
  },

  // Section E: Large numbers (blue boxes)
  ea: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 1000,
    divider: 1,
    boxColor: 'blue',
  },
  eb: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 10000,
    divider: 1,
    boxColor: 'blue',
  },

  // Section F: Decimal numbers (purple boxes)
  fa: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 10,
    divider: 10,
    boxColor: 'purple',
  },
  fb: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 100,
    divider: 100,
    boxColor: 'purple',
  },
  fc: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 1000,
    divider: 1000,
    boxColor: 'purple',
  },
  // Section A: Numbers 1-10 (red boxes)
  ga: {
    numberBoxes: 2,
    minimumValue: 1,
    maximumValue: 20,
    divider: 1,
    boxColor: 'red',
  },
  gb: {
    numberBoxes: 3,
    minimumValue: 1,
    maximumValue: 20,
    divider: 1,
    boxColor: 'red',
  },
  gc: {
    numberBoxes: 4,
    minimumValue: 1,
    maximumValue: 20,
    divider: 1,
    boxColor: 'red',
  },
};

export interface SortingGameExtendedVariantInfo extends SortingGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(variantInfo: SortingGameVariantInfo): string {
  // Red boxes = basic sorting (code E), Blue/Purple boxes = diverse sorting (code S)
  return variantInfo.boxColor === 'red' ? 'E' : 'S';
}

function createDescription(variantInfo: SortingGameVariantInfo): string {
  const numberBoxesText = `${variantInfo.numberBoxes} dozen`;

  if (variantInfo.divider === 1) {
    return `Zet ${numberBoxesText} met getallen van ${variantInfo.minimumValue} tot en met ${variantInfo.maximumValue} in de juiste volgorde`;
  } else {
    const decimalPlaces = Math.log10(variantInfo.divider);
    const decimalPlacesText = `${decimalPlaces} ${decimalPlaces === 1 ? 'cijfer' : 'cijfers'} achter de komma`;
    return `Kommagetallen met ${decimalPlacesText} (${numberBoxesText})`;
  }
}

export function getSortingGameVariant(
  variant: string,
): SortingGameExtendedVariantInfo {
  const variantInfo = sortingGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(variantInfo),
    description: createDescription(variantInfo),
  };
}
