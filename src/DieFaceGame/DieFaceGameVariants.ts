import { Color } from '../Colors';
import { type PossibleNumberDots } from '../DieFace';

interface DieFaceGameVariantInfo {
  iconColor: Color;
  numberDots: PossibleNumberDots;
}

const defaultVariant: DieFaceGameVariantInfo = {
  iconColor: 'purple',
  numberDots: 3,
};

// Export for testing
export const dieFaceGameVariants: Record<string, DieFaceGameVariantInfo> = {
  aa: defaultVariant,
};

export interface DieFaceGameExtendedVariantInfo extends DieFaceGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'AA';
}

function createDescription(): string {
  return 'Tel het aantal stippen op één dobbelsteen';
}

export function getDieFaceGameVariant(
  variant: string,
): DieFaceGameExtendedVariantInfo {
  const variantInfo = dieFaceGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(),
  };
}
