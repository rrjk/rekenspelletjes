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
      return [2, 3, 4, 5, 6, 7, 8, 9, 10];
    case '2-10':
      return [2, 3, 4, 5, 6, 7, 8, 9, 10];
    case '11-14':
      return [11, 12, 13, 14];
    case '11-19':
      return [11, 12, 13, 14, 15, 16, 17, 18, 19];
    case 'tens':
      return [10, 20];
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
  a: defaultVariant,
  b: { iconColor: 'red', operators: ['times'], tableSet: 2 },
  c: { iconColor: 'orange', operators: ['times'], tableSet: 5 },
  d: { iconColor: 'olive', operators: ['times'], tableSet: 3 },
  e: { iconColor: 'yellow', operators: ['times'], tableSet: 4 },
  f: { iconColor: 'lime', operators: ['times'], tableSet: 'firstHalf' },
  g: { iconColor: 'green', operators: ['times'], tableSet: 6 },
  h: { iconColor: 'mint', operators: ['times'], tableSet: 7 },
  i: { iconColor: 'cyan', operators: ['times'], tableSet: 8 },
  j: { iconColor: 'blue', operators: ['times'], tableSet: 9 },
  k: {
    iconColor: 'purple',
    operators: ['times'],
    tableSet: '2-10',
  },

  l: { iconColor: 'maroon', operators: ['divide'], tableSet: 10 },
  m: { iconColor: 'red', operators: ['divide'], tableSet: 2 },
  n: { iconColor: 'orange', operators: ['divide'], tableSet: 5 },
  o: { iconColor: 'yellow', operators: ['divide'], tableSet: 3 },
  p: { iconColor: 'lime', operators: ['divide'], tableSet: 4 },
  q: { iconColor: 'green', operators: ['divide'], tableSet: 'firstHalf' },
  r: { iconColor: 'cyan', operators: ['divide'], tableSet: 6 },
  s: { iconColor: 'navy', operators: ['divide'], tableSet: 7 },
  t: { iconColor: 'blue', operators: ['divide'], tableSet: 8 },
  u: { iconColor: 'purple', operators: ['divide'], tableSet: 9 },
  v: { iconColor: 'magenta', operators: ['divide'], tableSet: '2-10' },

  w: { iconColor: 'magenta', operators: ['divide', 'times'], tableSet: 10 },
  x: { iconColor: 'purple', operators: ['divide', 'times'], tableSet: 2 },
  y: { iconColor: 'blue', operators: ['divide', 'times'], tableSet: 5 },
  z: { iconColor: 'navy', operators: ['divide', 'times'], tableSet: 3 },
  aa: { iconColor: 'cyan', operators: ['divide', 'times'], tableSet: 4 },
  ab: {
    iconColor: 'green',
    operators: ['divide', 'times'],
    tableSet: 'firstHalf',
  },
  ac: { iconColor: 'lime', operators: ['divide', 'times'], tableSet: 6 },
  ad: { iconColor: 'yellow', operators: ['divide', 'times'], tableSet: 7 },
  ae: { iconColor: 'orange', operators: ['divide', 'times'], tableSet: 8 },
  af: { iconColor: 'red', operators: ['divide', 'times'], tableSet: 9 },
  ag: { iconColor: 'maroon', operators: ['divide', 'times'], tableSet: '2-10' },

  ah: { iconColor: 'red', operators: ['divide'], tableSet: 11 },
  ai: { iconColor: 'orange', operators: ['divide'], tableSet: 12 },
  aj: { iconColor: 'yellow', operators: ['divide'], tableSet: 13 },
  ak: { iconColor: 'lime', operators: ['divide'], tableSet: 14 },
  al: { iconColor: 'green', operators: ['divide'], tableSet: '11-14' },
  am: { iconColor: 'cyan', operators: ['divide'], tableSet: 15 },
  an: { iconColor: 'blue', operators: ['divide'], tableSet: 16 },
  ao: { iconColor: 'purple', operators: ['divide'], tableSet: 17 },
  ap: { iconColor: 'magenta', operators: ['divide'], tableSet: 18 },
  aq: { iconColor: 'lavender', operators: ['divide'], tableSet: 19 },
  ar: {
    iconColor: 'grey',
    operators: ['divide'],
    tableSet: '11-19',
  },

  as: { iconColor: 'maroon', operators: ['divide', 'times'], tableSet: 11 },
  at: { iconColor: 'brown', operators: ['divide', 'times'], tableSet: 12 },
  au: { iconColor: 'olive', operators: ['divide', 'times'], tableSet: 13 },
  av: { iconColor: 'teal', operators: ['divide', 'times'], tableSet: 14 },
  aw: {
    iconColor: 'navy',
    operators: ['divide', 'times'],
    tableSet: '11-14',
  },
  ax: { iconColor: 'pink', operators: ['divide', 'times'], tableSet: 15 },
  ay: { iconColor: 'apricot', operators: ['divide', 'times'], tableSet: 16 },
  az: { iconColor: 'beige', operators: ['divide', 'times'], tableSet: 17 },
  ba: { iconColor: 'mint', operators: ['divide', 'times'], tableSet: 18 },
  bb: { iconColor: 'black', operators: ['divide', 'times'], tableSet: 19 },
  bc: {
    iconColor: 'white',
    operators: ['divide', 'times'],
    tableSet: '11-19',
  },
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
    console.log(
      `tableSet: ${variantInfo.tableSet}, description: ${description}`,
    );
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
