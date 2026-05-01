import { Color } from '../Colors';

interface EggCountingGameVariantInfo {
  iconColor: Color;
  maxNumber: number;
}

const defaultVariant: EggCountingGameVariantInfo = {
  iconColor: 'beige',
  maxNumber: 99,
};

// Export for testing
export const eggCountingGameVariants: Record<
  string,
  EggCountingGameVariantInfo
> = {
  aa: defaultVariant,
};

export interface EggCountingGameExtendedVariantInfo
  extends EggCountingGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'J';
}

function createDescription(): string {
  return 'Eierdoos tellen';
}

export function getEggCountingGameVariant(
  variant: string,
): EggCountingGameExtendedVariantInfo {
  const variantInfo = eggCountingGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(),
  };
}
