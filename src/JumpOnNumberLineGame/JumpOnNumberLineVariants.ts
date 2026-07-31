import type { Color } from '../Colors';

interface JumpOnNumberLineVariantInfo {
  iconColor: Color;
  minimum: number;
  maximum: number;
  show10TickMarks: boolean;
  show5TickMarks: boolean;
  show1TickMarks: boolean;
  showAll10Numbers: boolean;
}

export interface JumpOnNumberLineExtendedVariantInfo
  extends JumpOnNumberLineVariantInfo {
  mainCode: string;
  description: string;
}

const defaultVariant: JumpOnNumberLineVariantInfo = {
  iconColor: 'maroon',
  minimum: 0,
  maximum: 20,
  show10TickMarks: true,
  show5TickMarks: true,
  show1TickMarks: true,
  showAll10Numbers: true,
};

export const jumpOnNumberLineVariants: Record<
  string,
  JumpOnNumberLineVariantInfo
> = {
  aa: defaultVariant, // Default: aa
  ab: {
    iconColor: 'brown',
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  ac: {
    iconColor: 'olive',
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  ad: {
    iconColor: 'teal',
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  ba: {
    iconColor: 'lavender',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  bb: {
    iconColor: 'beige',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  bc: {
    iconColor: 'apricot',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  bd: {
    iconColor: 'yellow',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  ca: {
    iconColor: 'orange',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  cb: {
    iconColor: 'red',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  cc: {
    iconColor: 'magenta',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  cd: {
    iconColor: 'pink',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  da: {
    iconColor: 'green',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  db: {
    iconColor: 'lime',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  dc: {
    iconColor: 'mint',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  dd: {
    iconColor: 'cyan',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
};

function determineMainCode(): string {
  return 'U';
}

function createDescription(variantInfo: JumpOnNumberLineVariantInfo): string {
  const rangeText = `${variantInfo.minimum} tot ${variantInfo.maximum}`;

  if (variantInfo.show1TickMarks) {
    return `Spring op een getallenlijn van ${rangeText}, met alle tientallen, vijf- en eenstreepjes`;
  }

  if (variantInfo.show5TickMarks) {
    return `Spring op een getallenlijn van ${rangeText}, met alle tientallen en vijfstreepjes`;
  }

  if (variantInfo.showAll10Numbers) {
    return `Spring op een getallenlijn van ${rangeText}, met alle tientalstreepjes`;
  }

  return `Spring op een getallenlijn van ${rangeText}, zonder streepjes`;
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
