import { Color } from '../Colors';
import { AdditionOperator } from '../Operator';
import { joinWithEn } from '../Utils';

interface AdditionSubstractionWholeDecadeGameVariantInfo {
  iconColor: Color;
  operators: AdditionOperator[];
  decadeFirst: boolean;
}

const defaultVariant: AdditionSubstractionWholeDecadeGameVariantInfo = {
  iconColor: 'red',
  operators: ['plus'],
  decadeFirst: false,
};

export const additionSubstractionWholeDecadeGameVariants: Record<
  string,
  AdditionSubstractionWholeDecadeGameVariantInfo
> = {
  // Section 1: Plus en min sommen met hele tientallen erbij of eraf
  aa: defaultVariant,
  ab: {
    iconColor: 'orange',
    operators: ['minus'],
    decadeFirst: false,
  },
  ac: {
    iconColor: 'yellow',
    operators: ['plus', 'minus'],
    decadeFirst: false,
  },
  // Section 2: Plus en min sommen vanuit een heel tiental
  ba: {
    iconColor: 'lime',
    operators: ['plus'],
    decadeFirst: true,
  },
  bb: {
    iconColor: 'green',
    operators: ['minus'],
    decadeFirst: true,
  },
  bc: {
    iconColor: 'cyan',
    operators: ['plus', 'minus'],
    decadeFirst: true,
  },
};

export interface AdditionSubstractionWholeDecadeGameExtendedVariantInfo
  extends AdditionSubstractionWholeDecadeGameVariantInfo {
  mainCode: string;
  description: string;
  exampleSums: string[];
}

function determineMainCode(): string {
  return 'B';
}

function getExampleSums(
  variantInfo: AdditionSubstractionWholeDecadeGameVariantInfo,
): string[] {
  const hasPlus = variantInfo.operators.includes('plus');
  const hasMinus = variantInfo.operators.includes('minus');
  const decadeFirst = variantInfo.decadeFirst;

  const exampleSums: string[] = [];

  if (!decadeFirst) {
    // Whole decades added/subtracted
    if (hasPlus) exampleSums.push('34+40');
    if (hasMinus) exampleSums.push('58−30');
  } else {
    // From whole decade
    if (hasPlus) exampleSums.push('50+8');
    if (hasMinus) exampleSums.push('70−5');
  }

  return exampleSums;
}

function createDescription(
  variantInfo: AdditionSubstractionWholeDecadeGameVariantInfo,
): string {
  const exampleSums = getExampleSums(variantInfo);

  if (exampleSums.length === 0) return 'Sommen';
  return `Sommen als ${joinWithEn(exampleSums)}`;
}

export function getAdditionSubstractionWholeDecadeGameVariant(
  variant: string,
): AdditionSubstractionWholeDecadeGameExtendedVariantInfo {
  const variantInfo =
    additionSubstractionWholeDecadeGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
    exampleSums: getExampleSums(variantInfo),
  };
}
