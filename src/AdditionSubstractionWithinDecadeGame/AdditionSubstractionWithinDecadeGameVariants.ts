import { Color } from '../Colors';
import { Operator } from '../Operator';

type Decade = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

interface AdditionSubstractionWithinDecadeGameVariantInfo {
  iconColor: Color;
  decades: Decade[];
  operators: Operator[];
}

const defaultVariant: AdditionSubstractionWithinDecadeGameVariantInfo = {
  iconColor: 'red',
  decades: [0],
  operators: ['plus'],
};

export const additionSubstractionWithinDecadeGameVariants: Record<
  string,
  AdditionSubstractionWithinDecadeGameVariantInfo
> = {
  // Section 1: Sommen tot de 10 (decade 0)
  aa: defaultVariant,
  ab: {
    iconColor: 'orange',
    decades: [0],
    operators: ['minus'],
  },
  ac: {
    iconColor: 'yellow',
    decades: [0],
    operators: ['plus', 'minus'],
  },
  // Section 2: Sommen van 10 tot 20 (decade 10)
  ba: {
    iconColor: 'lime',
    decades: [10],
    operators: ['plus'],
  },
  bb: {
    iconColor: 'green',
    decades: [10],
    operators: ['minus'],
  },
  bc: {
    iconColor: 'cyan',
    decades: [10],
    operators: ['plus', 'minus'],
  },
  // Section 3: Sommen tot de 100 (all decades)
  ca: {
    iconColor: 'pink',
    decades: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
    operators: ['plus'],
  },
  cb: {
    iconColor: 'apricot',
    decades: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
    operators: ['minus'],
  },
  cc: {
    iconColor: 'beige',
    decades: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
    operators: ['plus', 'minus'],
  },
};

export interface AdditionSubstractionWithinDecadeGameExtendedVariantInfo
  extends AdditionSubstractionWithinDecadeGameVariantInfo {
  mainCode: string;
  description: string;
  exampleSums: {
    text1: string;
    text2: string;
  };
}

function determineMainCode(): string {
  return 'A';
}

export function getExampleSums(
  variantInfo: AdditionSubstractionWithinDecadeGameVariantInfo,
): {
  text1: string;
  text2: string;
} {
  const decade = variantInfo.decades[0];
  const hasPlus = variantInfo.operators.includes('plus');
  const hasMinus = variantInfo.operators.includes('minus');

  let text1 = '';
  let text2 = '';

  if (variantInfo.decades.length === 1) {
    if (decade === 0) {
      if (hasPlus) text1 = '3+4';
      if (hasMinus) {
        if (text1 === '') text1 = '7-5';
        else text2 = '7-5';
      }
    } else if (decade === 10) {
      if (hasPlus) text1 = '13+4';
      if (hasMinus) {
        if (text1 === '') text1 = '17-5';
        else text2 = '17-5';
      }
    }
  } else {
    // All decades (0-90)
    if (hasPlus) text1 = '43+4';
    if (hasMinus) {
      if (text1 === '') text1 = '37-5';
      else text2 = '37-5';
    }
  }

  return { text1, text2 };
}

function createDescription(
  variantInfo: AdditionSubstractionWithinDecadeGameVariantInfo,
): string {
  const { text1, text2 } = getExampleSums(variantInfo);

  if (text2 === '') {
    return `Sommen als ${text1}`;
  } else {
    return `Sommen als ${text1} en ${text2}`;
  }
}

export function getAdditionSubstractionWithinDecadeGameVariant(
  variant: string,
): AdditionSubstractionWithinDecadeGameExtendedVariantInfo {
  const variantInfo =
    additionSubstractionWithinDecadeGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
    exampleSums: getExampleSums(variantInfo),
  };
}
