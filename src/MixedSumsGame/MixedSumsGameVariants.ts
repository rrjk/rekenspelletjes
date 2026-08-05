import { Color } from '../Colors';
import { splitInContiguousRanges } from '../NumberHelperFunctions';
import {
  MultiplicationOperator,
  AdditionOperator,
  Operator,
  operatorToDutch,
} from '../Operator';
import { UnexpectedValueError } from '../UnexpectedValueError';
import { CapitalizeFirstLetter, joinWithEn } from '../Utils';

export const mixedSumIcon = [
  'rectangle',
  'puzzlePiece',
  'multiplicationIcon',
] as const;

export type MixedSumIcon = (typeof mixedSumIcon)[number];

interface VariantBaseInfo<T extends Operator = Operator> {
  includePuzzle: boolean;
  iconColor: Color;
  maxAnswer: number;
  operators: T[];
}

type VariantTableInfo =
  | {
      maxTable: number;
      tables?: never;
    }
  | {
      maxTable?: never;
      tables: number[];
    };

type VariantInfo<T extends Operator = Operator> = VariantBaseInfo<T> &
  VariantTableInfo;

function isMultiplicationVariant(
  variant: VariantInfo,
): variant is VariantInfo<MultiplicationOperator> {
  return variant.operators.every(op => op === 'times' || op === 'divide');
}

function isAdditionVariant(
  variant: VariantInfo,
): variant is VariantInfo<AdditionOperator> {
  return variant.operators.every(op => op === 'plus' || op === 'minus');
}

export interface ExtendedVariantInfo extends VariantBaseInfo {
  icon: MixedSumIcon;
  mainCode: string;
  description: string;
  eligibleTables: number[];
}

const defaultVariant: VariantInfo = {
  includePuzzle: true,
  iconColor: 'lavender',
  maxAnswer: 10,
  maxTable: 10,
  operators: ['plus', 'minus'],
};

function createEligibleTables(variantInfo: VariantInfo): number[] {
  if (variantInfo.tables !== undefined) return [...variantInfo.tables];

  const eligibleTables: number[] = [];
  for (let table = 2; table <= variantInfo.maxTable; table += 1) {
    eligibleTables.push(table);
  }
  return eligibleTables;
}

export const mixedSumsGameVariants: Record<string, VariantInfo> = {
  aa: defaultVariant,
  ab: {
    includePuzzle: true,
    iconColor: 'red',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  ac: {
    includePuzzle: true,
    iconColor: 'orange',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  ad: {
    includePuzzle: true,
    iconColor: 'yellow',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['times', 'divide'],
  },
  ae: {
    includePuzzle: true,
    iconColor: 'lime',
    maxAnswer: 10,
    maxTable: 20,
    operators: ['times', 'divide'],
  },
  af: {
    includePuzzle: true,
    iconColor: 'green',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  ag: {
    includePuzzle: true,
    iconColor: 'mint',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  ah: {
    includePuzzle: true,
    iconColor: 'cyan',
    maxAnswer: 1000,
    maxTable: 20,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  ai: {
    includePuzzle: true,
    iconColor: 'pink',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['times'],
  },
  aj: {
    includePuzzle: true,
    iconColor: 'apricot',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['divide'],
  },
  ak: {
    includePuzzle: true,
    iconColor: 'malachite',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['plus'],
  },
  al: {
    includePuzzle: true,
    iconColor: 'amberFlame',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['minus'],
  },
  ba: {
    includePuzzle: false,
    iconColor: 'lavender',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  bb: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  bc: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus'],
  },
  bd: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['times', 'divide'],
  },
  be: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    maxTable: 20,
    operators: ['times', 'divide'],
  },
  bf: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  bg: {
    includePuzzle: false,
    iconColor: 'mint',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  bh: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 1000,
    maxTable: 20,
    operators: ['plus', 'minus', 'times', 'divide'],
  },
  bi: {
    includePuzzle: false,
    iconColor: 'pink',
    maxAnswer: 100,
    maxTable: 10,
    operators: ['times'],
  },
  bj: {
    includePuzzle: false,
    iconColor: 'apricot',
    maxAnswer: 1000,
    maxTable: 10,
    operators: ['divide'],
  },
  bk: {
    includePuzzle: false,
    iconColor: 'malachite',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['plus'],
  },
  bl: {
    includePuzzle: false,
    iconColor: 'amberFlame',
    maxAnswer: 10,
    maxTable: 10,
    operators: ['minus'],
  },
  ca: {
    includePuzzle: false,
    iconColor: 'lavender',
    maxAnswer: 10,
    tables: [5],
    operators: ['times'],
  },
  cb: {
    includePuzzle: false,
    iconColor: 'lavender',
    maxAnswer: 10,
    tables: [5, 7, 6, 9, 10, 13, 14, 15, 18],
    operators: ['times', 'divide', 'plus', 'minus'],
  },
};

function determineMainCode(variantInfo: VariantInfo): string {
  if (variantInfo.includePuzzle) {
    return 'AC';
  } else {
    return 'AD';
  }
}

export function createTableSetDescription(tables: number[]): string {
  if (tables.length === 0) {
    throw new Error('Tables array cannot be empty');
  }
  if (tables.length === 1) {
    return `tafel van ${tables[0]}`;
  }
  const contiguousTables = splitInContiguousRanges(tables);
  return `tafels van ${joinWithEn(
    contiguousTables.map(range => {
      if (range[0] === range[1]) {
        return range[0].toString();
      } else {
        return `${range[0]} - ${range[1]}`;
      }
    }),
  )}`;
}

function createMultiplicationGameDescription(
  variantInfo: VariantInfo<MultiplicationOperator>,
): string {
  const operatorWords = variantInfo.operators.map(el => operatorToDutch(el));
  if (variantInfo.maxTable !== undefined) {
    return `${joinWithEn(operatorWords)} sommen met de tafels tot en met ${variantInfo.maxTable}.`;
  } else if (variantInfo.tables !== undefined) {
    return `${joinWithEn(operatorWords)} sommen met de ${createTableSetDescription(variantInfo.tables)}.`;
  } else {
    throw new UnexpectedValueError(
      variantInfo,
      'Variant must have either maxTable or tables defined',
    );
  }
}

function createAdditionDescription(
  variantInfo: VariantInfo<AdditionOperator>,
): string {
  const operatorWords = variantInfo.operators.map(el => operatorToDutch(el));
  return `${joinWithEn(operatorWords)} sommen met antwoorden tot en met ${variantInfo.maxAnswer}.`;
}

function createMixedOperatorsDescription(variantInfo: VariantInfo): string {
  const operatorWords = variantInfo.operators.map(el => operatorToDutch(el));
  let description = `Gemengde ${joinWithEn(operatorWords)} sommen`;
  description += ` met antwoorden tot en met ${variantInfo.maxAnswer}`;
  if (variantInfo.tables !== undefined) {
    description += ` en de ${createTableSetDescription(variantInfo.tables)}`;
  } else {
    description += ` en de tafels tot en met ${variantInfo.maxTable}`;
  }
  description += '.';
  return description;
}

function createGameDescription(variantInfo: VariantInfo): string {
  if (variantInfo.operators.length === 0) {
    throw new Error('Variant must have at least one operator');
  } else if (isMultiplicationVariant(variantInfo)) {
    return createMultiplicationGameDescription(variantInfo);
  } else if (isAdditionVariant(variantInfo)) {
    return createAdditionDescription(variantInfo);
  } else {
    return createMixedOperatorsDescription(variantInfo);
  }
}

function determineIcon(variantInfo: VariantInfo): MixedSumIcon {
  if (
    variantInfo.operators.includes('times') ||
    variantInfo.operators.includes('divide')
  ) {
    if (variantInfo.maxTable != undefined)
      return variantInfo.includePuzzle ? 'puzzlePiece' : 'rectangle';
    else if (variantInfo.tables != undefined) {
      if (
        variantInfo.operators.includes('plus') ||
        variantInfo.operators.includes('minus')
      )
        return variantInfo.includePuzzle ? 'puzzlePiece' : 'rectangle';
      else return 'multiplicationIcon';
    } else {
      throw new UnexpectedValueError(
        variantInfo,
        'Variant must have either maxTable or tables defined',
      );
    }
  } else return variantInfo.includePuzzle ? 'puzzlePiece' : 'rectangle';
}

export function getMixedSumsGameVariant(variant: string): ExtendedVariantInfo {
  const variantInfo = mixedSumsGameVariants[variant];
  if (!variantInfo) {
    throw new Error(`Unknown game variant: ${variant}`);
  }

  return {
    icon: determineIcon(variantInfo),
    iconColor: variantInfo.iconColor,
    maxAnswer: variantInfo.maxAnswer,
    operators: variantInfo.operators,
    includePuzzle: variantInfo.includePuzzle,
    eligibleTables: createEligibleTables(variantInfo),
    mainCode: determineMainCode(variantInfo),
    description: CapitalizeFirstLetter(createGameDescription(variantInfo)),
  };
}
