import { Color } from '../Colors';
import type { ArchType } from '../NumberLineV2';
import type {
  OperatorType,
  SplitType,
  JumpsOfTenType,
} from './NumberlineArchesGameAppLink';

interface NumberlineArchesGameVariantInfo {
  iconColor: Color;
  min: number;
  max: number;
  minNumberline: number;
  maxNumberline: number;
  operator: OperatorType;
  split: SplitType;
  jumpsOfTen: JumpsOfTenType;
  archesForIcon: ArchType[];
}

const defaultVariant: NumberlineArchesGameVariantInfo = {
  iconColor: 'olive',
  min: 0,
  max: 10,
  minNumberline: 0,
  maxNumberline: 10,
  operator: 'plus',
  split: 'noSplit',
  jumpsOfTen: 'noJumpsOfTen',
  archesForIcon: [{ from: 3, to: 7 }],
};

// Export for testing
export const numberlineArchesGameVariants: Record<
  string,
  NumberlineArchesGameVariantInfo
> = {
  // Plus variants
  aa: defaultVariant, // Default: aa
  ab: {
    iconColor: 'lavender',
    min: 10,
    max: 20,
    minNumberline: 0,
    maxNumberline: 20,
    operator: 'plus',
    split: 'noSplit',
    jumpsOfTen: 'noJumpsOfTen',
    archesForIcon: [{ from: 13, to: 17 }],
  },
  ac: {
    iconColor: 'apricot',
    min: 0,
    max: 20,
    minNumberline: 0,
    maxNumberline: 20,
    operator: 'plus',
    split: 'split',
    jumpsOfTen: 'noJumpsOfTen',
    archesForIcon: [
      { from: 6, to: 10 },
      { from: 10, to: 15 },
    ],
  },
  // Minus variants
  ba: {
    iconColor: 'pink',
    min: 0,
    max: 10,
    minNumberline: 0,
    maxNumberline: 10,
    operator: 'minus',
    split: 'noSplit',
    jumpsOfTen: 'noJumpsOfTen',
    archesForIcon: [{ from: 7, to: 2 }],
  },
  bb: {
    iconColor: 'orange',
    min: 10,
    max: 20,
    minNumberline: 0,
    maxNumberline: 20,
    operator: 'minus',
    split: 'noSplit',
    jumpsOfTen: 'noJumpsOfTen',
    archesForIcon: [{ from: 18, to: 13 }],
  },
  bc: {
    iconColor: 'olive',
    min: 0,
    max: 20,
    minNumberline: 0,
    maxNumberline: 20,
    operator: 'minus',
    split: 'split',
    jumpsOfTen: 'noJumpsOfTen',
    archesForIcon: [
      { from: 16, to: 10 },
      { from: 10, to: 7 },
    ],
  },
};

export interface NumberlineArchesGameExtendedVariantInfo
  extends NumberlineArchesGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'X';
}

function createDescription(
  variantInfo: NumberlineArchesGameVariantInfo,
): string {
  const operatorText = variantInfo.operator === 'plus' ? 'plus' : 'min';
  const splitText =
    variantInfo.split === 'split' ? 'met splitsen' : 'zonder splitsen';
  return `Getallenlijn boogjes spel: ${operatorText} sommen ${variantInfo.min} tot ${variantInfo.max}, ${splitText}`;
}

export function getNumberlineArchesGameVariant(
  variant: string,
): NumberlineArchesGameExtendedVariantInfo {
  const variantInfo = numberlineArchesGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
  };
}
