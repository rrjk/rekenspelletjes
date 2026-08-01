import type { Color } from '../Colors';
import type { FillInInfo, FixedNumberInfo } from './DivideWithSplitWidget';

export type Decade = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

interface DivisionWithSplitGameVariantInfo {
  iconColor: Color;
  decades: Decade[];
  showHelp: boolean;
  showSubAnswers: boolean;
  description: string;
  iconFixedNumbers: FixedNumberInfo;
  iconFillInNumbers: FillInInfo;
}

// Default: aa
const defaultVariant: DivisionWithSplitGameVariantInfo = {
  iconColor: 'lavender',
  decades: [10],
  showHelp: true,
  showSubAnswers: true,
  description: 'Delen met splitsen, antwoorden van 11 t/m 19',
  iconFixedNumbers: { dividend: 65, divisor: 5 },
  iconFillInNumbers: {
    split0: 50,
    split1: 15,
    subAnswer0: 10,
    subAnswer1: 3,
    answer: 13,
  },
};

export const divisionWithSplitGameVariants: Record<
  string,
  DivisionWithSplitGameVariantInfo
> = {
  aa: defaultVariant,
  ab: {
    iconColor: 'mint',
    decades: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    showHelp: true,
    showSubAnswers: true,
    description: 'Delen met splitsen, antwoorden van 11 t/m 99',
    iconFixedNumbers: { dividend: 175, divisor: 5 },
    iconFillInNumbers: {
      split0: 150,
      split1: 25,
      subAnswer0: 30,
      subAnswer1: 5,
      answer: 35,
    },
  },
  ac: {
    iconColor: 'apricot',
    decades: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    showHelp: false,
    showSubAnswers: false,
    description: 'Delen met splitsen, antwoorden van 11 t/m 99, zonder hulp',
    iconFixedNumbers: { dividend: 504, divisor: 7 },
    iconFillInNumbers: {
      split0: 490,
      split1: 14,
      subAnswer0: 70,
      subAnswer1: 2,
      answer: 72,
    },
  },
};

export interface DivisionWithSplitGameExtendedVariantInfo
  extends DivisionWithSplitGameVariantInfo {
  mainCode: string;
}

function determineMainCode(): string {
  return 'Z';
}

export function getDivisionWithSplitGameVariant(
  variant: string,
): DivisionWithSplitGameExtendedVariantInfo {
  const variantInfo = divisionWithSplitGameVariants[variant] || defaultVariant;

  return {
    ...variantInfo,
    decades: [...variantInfo.decades],
    iconFixedNumbers: { ...variantInfo.iconFixedNumbers },
    iconFillInNumbers: { ...variantInfo.iconFillInNumbers },
    mainCode: determineMainCode(),
  };
}
