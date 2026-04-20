import { Color, legacyBalloonColors, setOf20Colors } from './Colors';
import { MultiplicationOperator } from './Operator';
import { UnexpectedValueError } from './UnexpectedValueError';

export const ascendingImages = [
  'balloon',
  'rocket',
  'ufo',
  'zeppelin',
] as const;
export type AscendingImage = (typeof ascendingImages)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const singleTableSets = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;
type SingleTableSet = (typeof singleTableSets)[number];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MultipleTableSets = [
  'firstHalf',
  '2-10',
  '11-14',
  '11-19',
  'tens',
] as const;
type MultipleTableSet = (typeof MultipleTableSets)[number];

type TableSet = SingleTableSet | MultipleTableSet;

function isTableSetBelow10(tableSet: TableSet): boolean {
  if (typeof tableSet === 'number') {
    return tableSet <= 10;
  } else {
    return tableSet === 'firstHalf' || tableSet === '2-10';
  }
}

function getTablesForTableSet(tableSet: TableSet): number[] {
  if (typeof tableSet === 'number') {
    return [tableSet];
  }
  switch (tableSet) {
    case 'firstHalf':
      return [2, 3, 4, 5, 10];
    case '2-10':
      return [2, 3, 4, 5, 6, 7, 8, 9, 10];
    case '11-14':
      return [11, 12, 13, 14];
    case '11-19':
      return [11, 12, 13, 14, 15, 16, 17, 18, 19];
    case 'tens':
      return [10, 20, 30, 40, 50, 60, 70, 80, 90];
    default:
      throw new UnexpectedValueError(tableSet);
  }
}

function getTableStringForTableSet(tableSet: TableSet): string {
  if (typeof tableSet === 'number') {
    return `tafel van ${tableSet}`;
  }
  switch (tableSet) {
    case 'firstHalf':
      return 'tafels van 2, 3, 4, 5 en 10';
    case '2-10':
      return 'tafels van 2 tot en met 10';
    case '11-14':
      return 'tafels van 11 tot en met 14';
    case '11-19':
      return 'tafels van 11 tot en met 19';
    case 'tens':
      return 'tafels van de tientallen';
    default:
      throw new UnexpectedValueError(tableSet);
  }
}

interface VariantInfo {
  iconColor: Color;
  operators: MultiplicationOperator[];
  tableSet: TableSet;
}

const defaultVariant: VariantInfo = {
  iconColor: 'maroon',
  operators: ['times'],
  tableSet: 10,
};

const gameVariants: Partial<Record<string, VariantInfo>> = {
  aa: defaultVariant,
  ab: { iconColor: 'red', operators: ['times'], tableSet: 2 },
  ac: { iconColor: 'orange', operators: ['times'], tableSet: 5 },
  ad: { iconColor: 'olive', operators: ['times'], tableSet: 3 },
  ae: { iconColor: 'yellow', operators: ['times'], tableSet: 4 },
  af: { iconColor: 'lime', operators: ['times'], tableSet: 'firstHalf' },
  ag: { iconColor: 'green', operators: ['times'], tableSet: 6 },
  ah: { iconColor: 'mint', operators: ['times'], tableSet: 7 },
  ai: { iconColor: 'cyan', operators: ['times'], tableSet: 8 },
  aj: { iconColor: 'blue', operators: ['times'], tableSet: 9 },
  ak: {
    iconColor: 'purple',
    operators: ['times'],
    tableSet: '2-10',
  },
  ba: { iconColor: 'maroon', operators: ['divide'], tableSet: 10 },
  bb: { iconColor: 'red', operators: ['divide'], tableSet: 2 },
  bc: { iconColor: 'orange', operators: ['divide'], tableSet: 5 },
  bd: { iconColor: 'yellow', operators: ['divide'], tableSet: 3 },
  be: { iconColor: 'lime', operators: ['divide'], tableSet: 4 },
  bf: { iconColor: 'green', operators: ['divide'], tableSet: 'firstHalf' },
  bg: { iconColor: 'cyan', operators: ['divide'], tableSet: 6 },
  bh: { iconColor: 'navy', operators: ['divide'], tableSet: 7 },
  bi: { iconColor: 'blue', operators: ['divide'], tableSet: 8 },
  bj: { iconColor: 'purple', operators: ['divide'], tableSet: 9 },
  bk: { iconColor: 'magenta', operators: ['divide'], tableSet: '2-10' },

  ca: { iconColor: 'magenta', operators: ['divide', 'times'], tableSet: 10 },
  cb: { iconColor: 'purple', operators: ['divide', 'times'], tableSet: 2 },
  cc: { iconColor: 'blue', operators: ['divide', 'times'], tableSet: 5 },
  cd: { iconColor: 'navy', operators: ['divide', 'times'], tableSet: 3 },
  ce: { iconColor: 'cyan', operators: ['divide', 'times'], tableSet: 4 },
  cf: {
    iconColor: 'mint',
    operators: ['divide', 'times'],
    tableSet: 'firstHalf',
  },
  cg: { iconColor: 'lime', operators: ['divide', 'times'], tableSet: 6 },
  ch: { iconColor: 'yellow', operators: ['divide', 'times'], tableSet: 7 },
  ci: { iconColor: 'orange', operators: ['divide', 'times'], tableSet: 8 },
  cj: { iconColor: 'red', operators: ['divide', 'times'], tableSet: 9 },
  ck: { iconColor: 'maroon', operators: ['divide', 'times'], tableSet: '2-10' },

  da: { iconColor: 'red', operators: ['divide'], tableSet: 11 },
  db: { iconColor: 'orange', operators: ['divide'], tableSet: 12 },
  dc: { iconColor: 'yellow', operators: ['divide'], tableSet: 13 },
  dd: { iconColor: 'lime', operators: ['divide'], tableSet: 14 },
  de: { iconColor: 'green', operators: ['divide'], tableSet: '11-14' },
  df: { iconColor: 'cyan', operators: ['divide'], tableSet: 15 },
  dg: { iconColor: 'blue', operators: ['divide'], tableSet: 16 },
  dh: { iconColor: 'purple', operators: ['divide'], tableSet: 17 },
  di: { iconColor: 'magenta', operators: ['divide'], tableSet: 18 },
  dj: { iconColor: 'lavender', operators: ['divide'], tableSet: 19 },
  dk: {
    iconColor: 'grey',
    operators: ['divide'],
    tableSet: '11-19',
  },

  ea: { iconColor: 'maroon', operators: ['divide', 'times'], tableSet: 11 },
  eb: { iconColor: 'brown', operators: ['divide', 'times'], tableSet: 12 },
  ec: { iconColor: 'olive', operators: ['divide', 'times'], tableSet: 13 },
  ed: { iconColor: 'teal', operators: ['divide', 'times'], tableSet: 14 },
  ee: {
    iconColor: 'navy',
    operators: ['divide', 'times'],
    tableSet: '11-14',
  },
  ef: { iconColor: 'pink', operators: ['divide', 'times'], tableSet: 15 },
  eg: { iconColor: 'apricot', operators: ['divide', 'times'], tableSet: 16 },
  eh: { iconColor: 'beige', operators: ['divide', 'times'], tableSet: 17 },
  ei: { iconColor: 'mint', operators: ['divide', 'times'], tableSet: 18 },
  ej: { iconColor: 'black', operators: ['divide', 'times'], tableSet: 19 },
  ek: {
    iconColor: 'white',
    operators: ['divide', 'times'],
    tableSet: '11-19',
  },
  fa: { iconColor: 'maroon', operators: ['times'], tableSet: 'tens' },
  fb: { iconColor: 'red', operators: ['times'], tableSet: 11 },
  fc: { iconColor: 'orange', operators: ['times'], tableSet: 12 },
  fd: { iconColor: 'yellow', operators: ['times'], tableSet: 13 },
  fe: { iconColor: 'lime', operators: ['times'], tableSet: 14 },
  ff: { iconColor: 'brown', operators: ['times'], tableSet: '11-14' },
  fg: { iconColor: 'green', operators: ['times'], tableSet: 15 },
  fh: { iconColor: 'cyan', operators: ['times'], tableSet: 16 },
  fi: { iconColor: 'blue', operators: ['times'], tableSet: 17 },
  fj: { iconColor: 'purple', operators: ['times'], tableSet: 18 },
  fk: { iconColor: 'magenta', operators: ['times'], tableSet: 19 },
  fl: { iconColor: 'pink', operators: ['times'], tableSet: '11-19' },
};

export interface ExtendedVariantInfo extends VariantInfo {
  mainCode: string;
  colorSet: readonly Color[];
  image: AscendingImage;
  description: string;
  tables: number[];
}

const balloonGameExtendedInfo = {
  mainCode: 'D',
  colorSet: legacyBalloonColors,
  image: 'balloon',
} as const;

const zeppelinGameExtendedInfo = {
  mainCode: 'K',
  colorSet: setOf20Colors,
  image: 'zeppelin',
} as const;

const rocketGameExtenedInfo = {
  mainCode: 'C',
  colorSet: setOf20Colors,
  image: 'rocket',
} as const;

const ufoGameExtendedInfo = {
  mainCode: 'M',
  colorSet: setOf20Colors,
  image: 'ufo',
} as const;

export function getGameVariant(subCode: string): ExtendedVariantInfo {
  const variantInfo = gameVariants[subCode] || defaultVariant;

  if (variantInfo.operators.includes('divide')) {
    // The opeators might also include times, but that doesn't make a difference for the game type
    let description = '';
    if (variantInfo.operators.length === 1) {
      description = `Delen met de ${getTableStringForTableSet(variantInfo.tableSet)}.`;
    } else if (variantInfo.operators.length > 1) {
      description = `Delen en vermenigvuldigen met de ${getTableStringForTableSet(variantInfo.tableSet)}.`;
    }

    if (isTableSetBelow10(variantInfo.tableSet)) {
      return {
        ...variantInfo,
        ...rocketGameExtenedInfo,
        description: description,
        tables: getTablesForTableSet(variantInfo.tableSet),
      };
    } else {
      return {
        ...variantInfo,
        ...ufoGameExtendedInfo,
        description: description,
        tables: getTablesForTableSet(variantInfo.tableSet),
      };
    }
  } else if (variantInfo.operators.includes('times')) {
    // Here we are sure it does not include divide, hence we have the balloon or zeppelin game.
    const description = `Vermenigvuldigen met de ${getTableStringForTableSet(variantInfo.tableSet)}.`;
    if (isTableSetBelow10(variantInfo.tableSet)) {
      // We have only times, only tables till 10
      return {
        ...variantInfo,
        ...balloonGameExtendedInfo,
        description: description,
        tables: getTablesForTableSet(variantInfo.tableSet),
      };
    } else {
      // We have only times, but have tables above 10
      return {
        ...variantInfo,
        ...zeppelinGameExtendedInfo,
        description: description,
        tables: getTablesForTableSet(variantInfo.tableSet),
      };
    }
  } else {
    throw new Error('No operator specified in variant.');
  }
}
