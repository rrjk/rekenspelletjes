import { Color, legacyBalloonColors, setOf20Colors } from './Colors';
import { MultiplicationOperator } from './Operator';

export const ascendingImages = [
  'balloon',
  'rocket',
  'ufo',
  'zeppelin',
] as const;
export type AscendingImage = (typeof ascendingImages)[number];

interface VariantInfo {
  iconColor: Color;
  operators: MultiplicationOperator[];
  tables: number[];
}

export interface ExtendedVariantInfo extends VariantInfo {
  mainCode: string;
  colorSet: Color;
  image: AscendingImage;
}

const timesTill10ExtendedInfo = {
  mainCode: 'D',
  colorSet: legacyBalloonColors,
  image: 'balloon',
} as const;

const timesAbove10ExtendedInfo = {
  mainCode: 'K',
  colorSet: setOf20Colors,
  image: 'zeppelin',
} as const;

const timesDivideTill10ExtendedInfo = {
  mainCode: 'C',
  colorSet: setOf20Colors,
  image: 'rocket',
} as const;

const timesDivideAbove10ExtendedInfo = {
  mainCode: 'M',
  colorSet: setOf20Colors,
  image: 'ufo',
} as const;

const defaultVariant: VariantInfo = {
  iconColor: 'maroon',
  operators: ['times'],
  tables: [10],
};
const gameVariants: Partial<Record<string, VariantInfo>> = {
  a: defaultVariant,
  b: { iconColor: 'red', operators: ['times'], tables: [2] },
  c: { iconColor: 'red', operators: ['times', 'divide'], tables: [12] },
};

export function getGameVariant(subCode: string) {
  const variantInfo = gameVariants[subCode] || defaultVariant;

  if (
    variantInfo.operators.length === 1 &&
    variantInfo.operators.includes('times')
  ) {
    if (variantInfo.tables.filter(el => el > 10).length === 0) {
      // We have only times, only tables till 10
      return {
        ...variantInfo,
        ...timesTill10ExtendedInfo,
      };
    } else {
      // We have only times, but have tables above 10
      return {
        ...variantInfo,
        ...timesAbove10ExtendedInfo,
      };
    }
  } else if (
    variantInfo.operators.length === 2 &&
    variantInfo.operators.includes('times') &&
    variantInfo.operators.includes('divide')
  ) {
    if (variantInfo.tables.filter(el => el > 10).length === 0) {
      return {
        ...variantInfo,
        ...timesDivideTill10ExtendedInfo,
      };
    } else
      return {
        ...variantInfo,
        ...timesDivideAbove10ExtendedInfo,
      };
  } else {
    throw new Error('Unsupported variant');
  }
}
