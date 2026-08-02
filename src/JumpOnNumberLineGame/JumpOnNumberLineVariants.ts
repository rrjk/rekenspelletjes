import type { Color } from '../Colors';
import {
  DescribeNumberLineParameters,
  type NumberLineParameters,
} from '../NumberLineParameters';

interface JumpOnNumberLineVariantInfo {
  iconColor: Color;
  numberLineParameters: NumberLineParameters;
}

export interface JumpOnNumberLineExtendedVariantInfo
  extends JumpOnNumberLineVariantInfo {
  mainCode: string;
  description: string;
}

const defaultVariant: JumpOnNumberLineVariantInfo = {
  iconColor: 'maroon',
  numberLineParameters: {
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
};

export const jumpOnNumberLineVariants: Record<
  string,
  JumpOnNumberLineVariantInfo
> = {
  aa: defaultVariant, // Default: aa
  ab: {
    iconColor: 'brown',
    numberLineParameters: {
      minimum: 0,
      maximum: 20,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  ac: {
    iconColor: 'olive',
    numberLineParameters: {
      minimum: 0,
      maximum: 20,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  ad: {
    iconColor: 'teal',
    numberLineParameters: {
      minimum: 0,
      maximum: 20,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  ba: {
    iconColor: 'lavender',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  bb: {
    iconColor: 'beige',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  bc: {
    iconColor: 'apricot',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  bd: {
    iconColor: 'yellow',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  ca: {
    iconColor: 'orange',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  cb: {
    iconColor: 'red',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  cc: {
    iconColor: 'magenta',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  cd: {
    iconColor: 'pink',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  da: {
    iconColor: 'green',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  db: {
    iconColor: 'lime',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  dc: {
    iconColor: 'mint',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  dd: {
    iconColor: 'cyan',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
};

function determineMainCode(): string {
  return 'U';
}

function createDescription(variantInfo: JumpOnNumberLineVariantInfo): string {
  return `Spring op een getallenlijn ${DescribeNumberLineParameters(variantInfo.numberLineParameters, 'present')}`;
}

export function getJumpOnNumberLineVariant(
  variant: string,
): JumpOnNumberLineExtendedVariantInfo {
  const variantInfo = jumpOnNumberLineVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
  };
}
