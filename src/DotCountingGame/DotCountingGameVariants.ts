import { Color } from '../Colors';

interface DotCountingGameVariantInfo {
  iconColor: Color;
  countOnly: boolean;
  includeDifference: boolean;
  maxDifference: number;
}

// Default: aa
const defaultVariant: DotCountingGameVariantInfo = {
  iconColor: 'red',
  countOnly: true,
  includeDifference: false,
  maxDifference: 9,
};

export const dotCountingGameVariants: Record<
  string,
  DotCountingGameVariantInfo
> = {
  aa: defaultVariant,
  ab: {
    iconColor: 'orange',
    countOnly: false,
    includeDifference: false,
    maxDifference: 9,
  },
  ac: {
    iconColor: 'yellow',
    countOnly: false,
    includeDifference: true,
    maxDifference: 9,
  },
};

export interface DotCountingGameExtendedVariantInfo
  extends DotCountingGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'O';
}

function createDescription(variantInfo: DotCountingGameVariantInfo): string {
  if (variantInfo.countOnly) {
    return 'Tel de stippen';
  } else if (variantInfo.includeDifference) {
    return 'Welke hand heeft meer stippen? Hoeveel stippen meer?';
  } else {
    return 'Welke hand heeft meer stippen?';
  }
}

export function getDotCountingGameVariant(
  variant: string,
): DotCountingGameExtendedVariantInfo {
  const variantInfo = dotCountingGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
  };
}
