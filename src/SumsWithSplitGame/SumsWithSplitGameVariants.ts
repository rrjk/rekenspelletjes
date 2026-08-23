import type { Color } from '../Colors';
import type { AdditionOperator } from '../Operator';
import type { GameRangeType, ShowSplitsType } from './SumsWithSplitAppLink';

interface SumsWithSplitGameVariantInfo {
  iconColor: Color;
  game: GameRangeType;
  operators: AdditionOperator[];
  showSplits: ShowSplitsType;
}

// Default: aa
const defaultVariant: SumsWithSplitGameVariantInfo = {
  iconColor: 'olive',
  game: 'split1Till20',
  operators: ['plus'],
  showSplits: 'showSplits',
};

// Export for testing
export const sumsWithSplitGameVariants: Record<
  string,
  SumsWithSplitGameVariantInfo
> = {
  // Section A: Tot 20 met splitsen
  aa: defaultVariant,
  ab: {
    iconColor: 'brown',
    game: 'split1Till20',
    operators: ['minus'],
    showSplits: 'showSplits',
  },
  ac: {
    iconColor: 'maroon',
    game: 'split1Till20',
    operators: ['plus', 'minus'],
    showSplits: 'showSplits',
  },

  // Section A: Tot 20 uit het hoofd
  ad: {
    iconColor: 'olive',
    game: 'split1Till20',
    operators: ['plus'],
    showSplits: 'hideSplits',
  },
  ae: {
    iconColor: 'brown',
    game: 'split1Till20',
    operators: ['minus'],
    showSplits: 'hideSplits',
  },
  af: {
    iconColor: 'maroon',
    game: 'split1Till20',
    operators: ['plus', 'minus'],
    showSplits: 'hideSplits',
  },

  // Section B: Tot 100 (enkel splitsen) met splitsen
  ba: {
    iconColor: 'lavender',
    game: 'split1Till100',
    operators: ['plus'],
    showSplits: 'showSplits',
  },
  bb: {
    iconColor: 'purple',
    game: 'split1Till100',
    operators: ['minus'],
    showSplits: 'showSplits',
  },
  bc: {
    iconColor: 'magenta',
    game: 'split1Till100',
    operators: ['plus', 'minus'],
    showSplits: 'showSplits',
  },

  // Section B: Tot 100 (enkel splitsen) uit het hoofd
  bd: {
    iconColor: 'lavender',
    game: 'split1Till100',
    operators: ['plus'],
    showSplits: 'hideSplits',
  },
  be: {
    iconColor: 'purple',
    game: 'split1Till100',
    operators: ['minus'],
    showSplits: 'hideSplits',
  },
  bf: {
    iconColor: 'magenta',
    game: 'split1Till100',
    operators: ['plus', 'minus'],
    showSplits: 'hideSplits',
  },

  // Section C: Tot 100 (dubbel splitsen) met splitsen
  ca: {
    iconColor: 'teal',
    game: 'split2Till100',
    operators: ['plus'],
    showSplits: 'showSplits',
  },
  cb: {
    iconColor: 'mint',
    game: 'split2Till100',
    operators: ['minus'],
    showSplits: 'showSplits',
  },
  cc: {
    iconColor: 'blue',
    game: 'split2Till100',
    operators: ['plus', 'minus'],
    showSplits: 'showSplits',
  },

  // Section C: Tot 100 (dubbel splitsen) uit het hoofd
  cd: {
    iconColor: 'teal',
    game: 'split2Till100',
    operators: ['plus'],
    showSplits: 'hideSplits',
  },
  ce: {
    iconColor: 'mint',
    game: 'split2Till100',
    operators: ['minus'],
    showSplits: 'hideSplits',
  },
  cf: {
    iconColor: 'blue',
    game: 'split2Till100',
    operators: ['plus', 'minus'],
    showSplits: 'hideSplits',
  },
};

export interface SumsWithSplitGameExtendedVariantInfo
  extends SumsWithSplitGameVariantInfo {
  mainCode: string;
  description: string;
  exampleSums: {
    text1: string;
    text2: string;
  };
}

function determineMainCode(variantInfo: SumsWithSplitGameVariantInfo): string {
  return variantInfo.game === 'split2Till100' ? 'V' : 'G';
}

function getExampleSums(variantInfo: SumsWithSplitGameVariantInfo): {
  text1: string;
  text2: string;
} {
  let plusExample = '';
  let minusExample = '';

  if (variantInfo.game === 'split1Till20') {
    plusExample = '6+8';
    minusExample = '12−3';
  } else if (variantInfo.game === 'split1Till100') {
    plusExample = '36+8';
    minusExample = '52−3';
  } else {
    plusExample = '47+38';
    minusExample = '65−49';
  }

  const hasPlus = variantInfo.operators.includes('plus');
  const hasMinus = variantInfo.operators.includes('minus');

  return {
    text1: hasPlus ? plusExample : '',
    text2: hasMinus ? minusExample : '',
  };
}

function createDescription(variantInfo: SumsWithSplitGameVariantInfo): string {
  const exampleSums = getExampleSums(variantInfo);
  const examples =
    exampleSums.text1 !== '' && exampleSums.text2 !== ''
      ? `${exampleSums.text1} en ${exampleSums.text2}`
      : exampleSums.text1 !== ''
        ? exampleSums.text1
        : exampleSums.text2;

  if (variantInfo.showSplits === 'showSplits') {
    return `Sommen zoals ${examples}, met splitsen`;
  }

  return `Sommen zoals ${examples}, uit het hoofd splitsen`;
}

export function getSumsWithSplitGameVariant(
  variant: string,
): SumsWithSplitGameExtendedVariantInfo {
  const variantInfo = sumsWithSplitGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    operators: [...variantInfo.operators],
    mainCode: determineMainCode(variantInfo),
    description: createDescription(variantInfo),
    exampleSums: getExampleSums(variantInfo),
  };
}
