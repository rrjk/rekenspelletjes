import { Color } from '../Colors';
import { joinWithEn } from '../Utils';

interface VariantInfo {
  iconColor: Color;
  numbersToSplit: number[];
}

const defaultVariant: VariantInfo = {
  iconColor: 'lavender',
  numbersToSplit: [3],
};

const gameVariants: Record<string, VariantInfo> = {
  // Single digit splitting - Eén cijfer splitsen (section a)
  aa: {
    iconColor: 'lavender',
    numbersToSplit: [3],
  },
  ab: {
    iconColor: 'red',
    numbersToSplit: [4],
  },
  ac: {
    iconColor: 'orange',
    numbersToSplit: [5],
  },
  ad: {
    iconColor: 'yellow',
    numbersToSplit: [6],
  },
  ae: {
    iconColor: 'lime',
    numbersToSplit: [7],
  },
  af: {
    iconColor: 'green',
    numbersToSplit: [8],
  },
  ag: {
    iconColor: 'mint',
    numbersToSplit: [9],
  },
  ah: {
    iconColor: 'cyan',
    numbersToSplit: [10],
  },
  // Multiple digit splitting - Meerdere cijfers splitsen (section b)
  ba: {
    iconColor: 'navy',
    numbersToSplit: [1, 2, 3, 4, 5, 10],
  },
  bb: {
    iconColor: 'blue',
    numbersToSplit: [6, 7, 8, 9, 10],
  },
  bc: {
    iconColor: 'purple',
    numbersToSplit: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
};

export { gameVariants };

export interface ExtendedVariantInfo extends VariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'R';
}

function createDescription(variantInfo: VariantInfo): string {
  const numbers = variantInfo.numbersToSplit;
  if (numbers.length === 1) {
    return `Splitsingen van ${numbers[0]}`;
  } else {
    const sorted = [...numbers].sort((a, b) => a - b);
    if (
      sorted.length === 6 &&
      sorted[0] === 1 &&
      sorted[4] === 5 &&
      sorted[5] === 10
    ) {
      return 'Splitsingen van 1 t/m 5 en 10';
    } else if (sorted.length === 5 && sorted[0] === 6 && sorted[4] === 10) {
      return 'Splitsingen van 6 t/m 10';
    } else if (sorted.length === 10 && sorted[0] === 1 && sorted[9] === 10) {
      return 'Splitsingen van 1 t/m 10';
    } else {
      return `Splitsingen van ${joinWithEn(sorted)}`;
    }
  }
}

/**
 * Get the variant information for a given variant code
 * @param variant The variant code (e.g., 'aa', 'ab', etc.) If an empty or non-existent variant is provided, the default variant is returned
 * @returns The variant information with mainCode and description
 */
export function getSplitBalloonGameVariant(
  variant: string,
): ExtendedVariantInfo {
  const variantInfo = gameVariants[variant] || defaultVariant;

  const mainCode = determineMainCode();
  const description = createDescription(variantInfo);

  return {
    ...variantInfo,
    mainCode,
    description,
  };
}
