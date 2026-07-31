interface TensSplitGameVariantInfo {
  minTens: number;
  maxTens: number;
  minUnits: number;
  maxUnits: number;
  iconNumberToSplit: number;
  iconActiveDigit: number;
}

// Default: aa
const defaultVariant: TensSplitGameVariantInfo = {
  minTens: 1,
  maxTens: 9,
  minUnits: 1,
  maxUnits: 9,
  iconNumberToSplit: 56,
  iconActiveDigit: 2,
};

// Export for testing
export const tensSplitGameVariants: Record<string, TensSplitGameVariantInfo> = {
  aa: defaultVariant,
};

export interface TensSplitGameExtendedVariantInfo
  extends TensSplitGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'W';
}

function createDescription(): string {
  return 'Splits het getal in tientallen en eenheden';
}

export function getTensSplitGameVariant(
  variant: string,
): TensSplitGameExtendedVariantInfo {
  const variantInfo = tensSplitGameVariants[variant] || defaultVariant;

  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(),
  };
}
