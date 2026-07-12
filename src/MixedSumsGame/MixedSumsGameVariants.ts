import { Color } from '../Colors';
import { Operator, operatorToDutch } from '../Operator';
import { UnexpectedValueError } from '../UnexpectedValueError';
import { joinWithEn } from '../Utils';

export const mixedSumIcon = ['rectangle', 'puzzlePiece'] as const;

export type MixedSumIcon = (typeof mixedSumIcon)[number];

interface VariantInfo {
  icon: MixedSumIcon;
  iconColor: Color;
  maxAnswer: number;
  maxTable: number;
  operators: Operator[];
}

export interface ExtendedVariantInfo extends VariantInfo {
  mainCode: string;
  description: string;
}

const defaultVariant: VariantInfo = {
  icon: 'puzzlePiece',
  iconColor: 'lavender',
  maxAnswer: 10,
  maxTable: 10,
  operators: ['plus', 'minus'],
};

export const mixedSumsGameVariants: Record<string, VariantInfo> = {
  aa: defaultVariant,
  ab: {
    icon: 'puzzlePiece',
    iconColor: 'red',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  ac: {
    icon: 'puzzlePiece',
    iconColor: 'orange',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  ad: {
    icon: 'puzzlePiece',
    iconColor: 'yellow',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['times', 'divide'],
  },
  ae: {
    icon: 'puzzlePiece',
    iconColor: 'lime',
    maxAnswer: 10,
    maxTable: 20,
    operators: ['times', 'divide'],
  },
  af: {
    icon: 'puzzlePiece',
    iconColor: 'green',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  ag: {
    icon: 'puzzlePiece',
    iconColor: 'mint',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  ah: {
    icon: 'puzzlePiece',
    iconColor: 'cyan',
    maxAnswer: 1000,
    maxTable: 20,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  ai: {
    icon: 'puzzlePiece',
    iconColor: 'pink',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['times'],
  },
  aj: {
    icon: 'puzzlePiece',
    iconColor: 'apricot',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['divide'],
  },
  ak: {
    icon: 'puzzlePiece',
    iconColor: 'malachite',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['plus'],
  },
  ba: {
    icon: 'rectangle',
    iconColor: 'lavender',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  bb: {
    icon: 'rectangle',
    iconColor: 'red',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  bc: {
    icon: 'rectangle',
    iconColor: 'orange',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  bd: {
    icon: 'rectangle',
    iconColor: 'yellow',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['times', 'divide'],
  },
  be: {
    icon: 'rectangle',
    iconColor: 'lime',
    maxAnswer: 10,
    maxTable: 20,
    operators: ['times', 'divide'],
  },
  bf: {
    icon: 'rectangle',
    iconColor: 'green',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  bg: {
    icon: 'rectangle',
    iconColor: 'mint',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  bh: {
    icon: 'rectangle',
    iconColor: 'cyan',
    maxAnswer: 1000,
    maxTable: 20,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  bi: {
    icon: 'rectangle',
    iconColor: 'pink',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['times'],
  },
  bj: {
    icon: 'rectangle',
    iconColor: 'apricot',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['divide'],
  },
  bk: {
    icon: 'rectangle',
    iconColor: 'malachite',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['plus'],
  },
};

function determineMainCode(variantInfo: VariantInfo): string {
  let mainCode = 'AC';
  switch (variantInfo.icon) {
    case 'rectangle':
      mainCode = 'AD';
      break;
    case 'puzzlePiece':
      mainCode = 'AC';
      break;
    default:
      throw new UnexpectedValueError(variantInfo.icon);
  }
  return mainCode;
}

function determineSumCategoryText(variantInfo: VariantInfo) {
  let plusMinusSumMaximumText = '';
  if (
    variantInfo.operators.includes('plus') ||
    variantInfo.operators.includes('minus')
  ) {
    plusMinusSumMaximumText = `antwoorden tot en met ${variantInfo.maxAnswer}`;
  }

  let divideTimesTableText = '';
  if (
    variantInfo.operators.includes('divide') ||
    variantInfo.operators.includes('times')
  ) {
    divideTimesTableText = `tafels tot en met ${variantInfo.maxTable}`;
  }
  return { plusMinusSumMaximumText, divideTimesTableText };
}

export function getMixedSumsGameVariant(variant: string): ExtendedVariantInfo {
  const variantInfo = mixedSumsGameVariants[variant];
  if (!variantInfo) {
    throw new Error(`Unknown game variant: ${variant}`);
  }

  const mainCode = determineMainCode(variantInfo);
  const operatorWords = variantInfo.operators.map(el => operatorToDutch(el));

  const { plusMinusSumMaximumText, divideTimesTableText } =
    determineSumCategoryText(variantInfo);

  let enText = '';
  if (plusMinusSumMaximumText !== '' && divideTimesTableText !== '') {
    enText = ' en ';
  }

  const description = `Gemengde ${joinWithEn(operatorWords)} sommen met ${plusMinusSumMaximumText}${enText}${divideTimesTableText}.`;

  return { ...variantInfo, mainCode, description };
}
