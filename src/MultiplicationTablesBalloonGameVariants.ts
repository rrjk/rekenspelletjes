import { Color, legacyBalloonColors, setOf20Colors } from './Colors';
import { MultiplicationOperator } from './Operator';

export const ascendingImages = [
  'balloon',
  'rocket',
  'ufo',
  'zeppelin',
] as const;
export type AscendingImage = (typeof ascendingImages)[number];

const defaultVariant: VariantInfo = {
  iconColor: 'maroon',
  operators: ['times'],
  tables: [10],
};

const gameVariants: Partial<Record<string, VariantInfo>> = {
  a: defaultVariant,
  b: { iconColor: 'red', operators: ['times'], tables: [2] },
  c: { iconColor: 'orange', operators: ['times'], tables: [5] },
  d: { iconColor: 'olive', operators: ['times'], tables: [3] },
  e: { iconColor: 'yellow', operators: ['times'], tables: [4] },
  f: { iconColor: 'lime', operators: ['times'], tables: [2, 3, 4, 5, 10] },
  g: { iconColor: 'green', operators: ['times'], tables: [6] },
  h: { iconColor: 'mint', operators: ['times'], tables: [7] },
  i: { iconColor: 'cyan', operators: ['times'], tables: [8] },
  j: { iconColor: 'blue', operators: ['times'], tables: [9] },
  k: {
    iconColor: 'purple',
    operators: ['times'],
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  l: { iconColor: 'red', operators: ['divide'], tables: [11] },
  m: { iconColor: 'orange', operators: ['divide'], tables: [12] },
  n: { iconColor: 'yellow', operators: ['divide'], tables: [13] },
  o: { iconColor: 'lime', operators: ['divide'], tables: [14] },
  p: { iconColor: 'green', operators: ['divide'], tables: [11, 12, 13, 14] },
  q: { iconColor: 'cyan', operators: ['divide'], tables: [15] },
  r: { iconColor: 'blue', operators: ['divide'], tables: [16] },
  s: { iconColor: 'purple', operators: ['divide'], tables: [17] },
  t: { iconColor: 'magenta', operators: ['divide'], tables: [18] },
  u: { iconColor: 'lavender', operators: ['divide'], tables: [19] },
  v: {
    iconColor: 'grey',
    operators: ['divide'],
    tables: [11, 12, 13, 14, 15, 16, 17, 18, 19],
  },

  w: { iconColor: 'maroon', operators: ['divide', 'times'], tables: [11] },
  x: { iconColor: 'brown', operators: ['divide', 'times'], tables: [12] },
  y: { iconColor: 'olive', operators: ['divide', 'times'], tables: [13] },
  z: { iconColor: 'teal', operators: ['divide', 'times'], tables: [14] },
  aa: {
    iconColor: 'navy',
    operators: ['divide', 'times'],
    tables: [11, 12, 13, 14],
  },
  ab: { iconColor: 'pink', operators: ['divide', 'times'], tables: [15] },
  ac: { iconColor: 'apricot', operators: ['divide', 'times'], tables: [16] },
  ad: { iconColor: 'beige', operators: ['divide', 'times'], tables: [17] },
  ae: { iconColor: 'mint', operators: ['divide', 'times'], tables: [18] },
  af: { iconColor: 'black', operators: ['divide', 'times'], tables: [19] },
  ag: {
    iconColor: 'white',
    operators: ['divide', 'times'],
    tables: [11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
};

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

export function getGameVariant(subCode: string) {
  const variantInfo = gameVariants[subCode] || defaultVariant;

  if (variantInfo.operators.includes('divide')) {
    // The opeators might also include times, but that doesn't make a difference for the game type
    if (variantInfo.tables.filter(el => el > 10).length === 0) {
      return {
        ...variantInfo,
        ...rocketGameExtenedInfo,
      };
    } else
      return {
        ...variantInfo,
        ...ufoGameExtendedInfo,
      };
  } else if (variantInfo.operators.includes('times')) {
    // Here we are sure it does not include divide, hence we have the balloon or zeppelin game.
    if (variantInfo.tables.filter(el => el > 10).length === 0) {
      // We have only times, only tables till 10
      return {
        ...variantInfo,
        ...balloonGameExtendedInfo,
      };
    } else {
      // We have only times, but have tables above 10
      return {
        ...variantInfo,
        ...zeppelinGameExtendedInfo,
      };
    }
  } else {
    throw new Error('No operator specified in variant.');
  }
}
