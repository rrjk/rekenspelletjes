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
    iconColor: 'maroon',
    maxAnswer: 10,
    tables: [10],
    operators: ['times'],
  },
  cb: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 10,
    tables: [2],
    operators: ['times'],
  },
  cc: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 10,
    tables: [5],
    operators: ['times'],
  },
  cd: {
    includePuzzle: false,
    iconColor: 'olive',
    maxAnswer: 10,
    tables: [3],
    operators: ['times'],
  },
  ce: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    tables: [4],
    operators: ['times'],
  },
  cf: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    tables: [2, 3, 4, 5, 10],
    operators: ['times'],
  },
  cg: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 10,
    tables: [6],
    operators: ['times'],
  },
  ch: {
    includePuzzle: false,
    iconColor: 'mint',
    maxAnswer: 10,
    tables: [7],
    operators: ['times'],
  },
  ci: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 10,
    tables: [8],
    operators: ['times'],
  },
  cj: {
    includePuzzle: false,
    iconColor: 'blue',
    maxAnswer: 10,
    tables: [9],
    operators: ['times'],
  },
  ck: {
    includePuzzle: false,
    iconColor: 'purple',
    maxAnswer: 10,
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    operators: ['times'],
  },
  da: {
    includePuzzle: false,
    iconColor: 'maroon',
    maxAnswer: 10,
    tables: [10],
    operators: ['divide'],
  },
  db: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 10,
    tables: [2],
    operators: ['divide'],
  },
  dc: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 10,
    tables: [5],
    operators: ['divide'],
  },
  dd: {
    includePuzzle: false,
    iconColor: 'olive',
    maxAnswer: 10,
    tables: [3],
    operators: ['divide'],
  },
  de: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    tables: [4],
    operators: ['divide'],
  },
  df: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    tables: [2, 3, 4, 5, 10],
    operators: ['divide'],
  },
  dg: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 10,
    tables: [6],
    operators: ['divide'],
  },
  dh: {
    includePuzzle: false,
    iconColor: 'mint',
    maxAnswer: 10,
    tables: [7],
    operators: ['divide'],
  },
  di: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 10,
    tables: [8],
    operators: ['divide'],
  },
  dj: {
    includePuzzle: false,
    iconColor: 'blue',
    maxAnswer: 10,
    tables: [9],
    operators: ['divide'],
  },
  dk: {
    includePuzzle: false,
    iconColor: 'purple',
    maxAnswer: 10,
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    operators: ['divide'],
  },
  ea: {
    includePuzzle: false,
    iconColor: 'maroon',
    maxAnswer: 10,
    tables: [10],
    operators: ['divide', 'times'],
  },
  eb: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 10,
    tables: [2],
    operators: ['divide', 'times'],
  },
  ec: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 10,
    tables: [5],
    operators: ['divide', 'times'],
  },
  ed: {
    includePuzzle: false,
    iconColor: 'olive',
    maxAnswer: 10,
    tables: [3],
    operators: ['divide', 'times'],
  },
  ee: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    tables: [4],
    operators: ['divide', 'times'],
  },
  ef: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    tables: [2, 3, 4, 5, 10],
    operators: ['divide', 'times'],
  },
  eg: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 10,
    tables: [6],
    operators: ['divide', 'times'],
  },
  eh: {
    includePuzzle: false,
    iconColor: 'mint',
    maxAnswer: 10,
    tables: [7],
    operators: ['divide', 'times'],
  },
  ei: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 10,
    tables: [8],
    operators: ['divide', 'times'],
  },
  ej: {
    includePuzzle: false,
    iconColor: 'blue',
    maxAnswer: 10,
    tables: [9],
    operators: ['divide', 'times'],
  },
  ek: {
    includePuzzle: false,
    iconColor: 'purple',
    maxAnswer: 10,
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    operators: ['divide', 'times'],
  },
  fa: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 10,
    tables: [11],
    operators: ['times'],
  },
  fb: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 10,
    tables: [12],
    operators: ['times'],
  },
  fc: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    tables: [13],
    operators: ['times'],
  },
  fd: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    tables: [14],
    operators: ['times'],
  },
  fe: {
    includePuzzle: false,
    iconColor: 'brown',
    maxAnswer: 10,
    tables: [11, 12, 13, 14],
    operators: ['times'],
  },
  ff: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 10,
    tables: [15],
    operators: ['times'],
  },
  fg: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 10,
    tables: [16],
    operators: ['times'],
  },
  fh: {
    includePuzzle: false,
    iconColor: 'blue',
    maxAnswer: 10,
    tables: [17],
    operators: ['times'],
  },
  fi: {
    includePuzzle: false,
    iconColor: 'purple',
    maxAnswer: 10,
    tables: [18],
    operators: ['times'],
  },
  fj: {
    includePuzzle: false,
    iconColor: 'magenta',
    maxAnswer: 10,
    tables: [19],
    operators: ['times'],
  },
  fk: {
    includePuzzle: false,
    iconColor: 'pink',
    maxAnswer: 10,
    tables: [11, 12, 13, 14, 15, 16, 17, 18, 19],
    operators: ['times'],
  },
  ga: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 10,
    tables: [11],
    operators: ['divide'],
  },
  gb: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 10,
    tables: [12],
    operators: ['divide'],
  },
  gc: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    tables: [13],
    operators: ['divide'],
  },
  gd: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    tables: [14],
    operators: ['divide'],
  },
  ge: {
    includePuzzle: false,
    iconColor: 'brown',
    maxAnswer: 10,
    tables: [11, 12, 13, 14],
    operators: ['divide'],
  },
  gf: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 10,
    tables: [15],
    operators: ['divide'],
  },
  gg: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 10,
    tables: [16],
    operators: ['divide'],
  },
  gh: {
    includePuzzle: false,
    iconColor: 'blue',
    maxAnswer: 10,
    tables: [17],
    operators: ['divide'],
  },
  gi: {
    includePuzzle: false,
    iconColor: 'purple',
    maxAnswer: 10,
    tables: [18],
    operators: ['divide'],
  },
  gj: {
    includePuzzle: false,
    iconColor: 'magenta',
    maxAnswer: 10,
    tables: [19],
    operators: ['divide'],
  },
  gk: {
    includePuzzle: false,
    iconColor: 'pink',
    maxAnswer: 10,
    tables: [11, 12, 13, 14, 15, 16, 17, 18, 19],
    operators: ['divide'],
  },
  ha: {
    includePuzzle: false,
    iconColor: 'red',
    maxAnswer: 10,
    tables: [11],
    operators: ['divide', 'times'],
  },
  hb: {
    includePuzzle: false,
    iconColor: 'orange',
    maxAnswer: 10,
    tables: [12],
    operators: ['divide', 'times'],
  },
  hc: {
    includePuzzle: false,
    iconColor: 'yellow',
    maxAnswer: 10,
    tables: [13],
    operators: ['divide', 'times'],
  },
  hd: {
    includePuzzle: false,
    iconColor: 'lime',
    maxAnswer: 10,
    tables: [14],
    operators: ['divide', 'times'],
  },
  he: {
    includePuzzle: false,
    iconColor: 'brown',
    maxAnswer: 10,
    tables: [11, 12, 13, 14],
    operators: ['divide', 'times'],
  },
  hf: {
    includePuzzle: false,
    iconColor: 'green',
    maxAnswer: 10,
    tables: [15],
    operators: ['divide', 'times'],
  },
  hg: {
    includePuzzle: false,
    iconColor: 'cyan',
    maxAnswer: 10,
    tables: [16],
    operators: ['divide', 'times'],
  },
  hh: {
    includePuzzle: false,
    iconColor: 'blue',
    maxAnswer: 10,
    tables: [17],
    operators: ['divide', 'times'],
  },
  hi: {
    includePuzzle: false,
    iconColor: 'purple',
    maxAnswer: 10,
    tables: [18],
    operators: ['divide', 'times'],
  },
  hj: {
    includePuzzle: false,
    iconColor: 'magenta',
    maxAnswer: 10,
    tables: [19],
    operators: ['divide', 'times'],
  },
  hk: {
    includePuzzle: false,
    iconColor: 'pink',
    maxAnswer: 10,
    tables: [11, 12, 13, 14, 15, 16, 17, 18, 19],
    operators: ['divide', 'times'],
  },
};

function determineMainCode(variantInfo: VariantInfo): string {
  if (variantInfo.maxTable && variantInfo.includePuzzle) {
    return 'AC';
  } else if (variantInfo.maxTable && !variantInfo.includePuzzle) {
    return 'AD';
  } else if (variantInfo.tables && variantInfo.operators.includes('divide')) {
    return 'AF';
  } else {
    return 'AE';
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
    return `${joinWithEn(operatorWords)} sommen met de tafels tot en met ${variantInfo.maxTable}, waarbij het antwoord ingetypt moet worden.`;
  } else if (variantInfo.tables !== undefined) {
    return `${joinWithEn(operatorWords)} sommen met de ${createTableSetDescription(variantInfo.tables)}, waarbij het antwoord ingetypt moet worden.`;
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
  return `${joinWithEn(operatorWords)} sommen met antwoorden tot en met ${variantInfo.maxAnswer}, waarbij het antwoord ingetypt moet worden.`;
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
  description += ', waarbij het antwoord ingetypt moet worden.';
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
