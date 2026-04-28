import { Color } from '../Colors';

interface HowManyFingersGameVariantInfo {
  iconColor: Color;
  minFingers: number;
  maxFingers: number;
}

export interface HowManyFingersGameExtendedVariantInfo
  extends HowManyFingersGameVariantInfo {
  mainCode: string;
  description: string;
}

const defaultVariant: HowManyFingersGameVariantInfo = {
  iconColor: 'purple',
  minFingers: 1,
  maxFingers: 5,
};

export const howManyFingersGameVariants: Record<
  string,
  HowManyFingersGameVariantInfo
> = {
  aa: {
    iconColor: 'purple',
    minFingers: 1,
    maxFingers: 5,
  },
  ab: {
    iconColor: 'red',
    minFingers: 1,
    maxFingers: 10,
  },
};

function determineMainCode(): string {
  return 'AB';
}

function createDescription(variantInfo: HowManyFingersGameVariantInfo): string {
  const handText =
    variantInfo.maxFingers <= 5 ? 'op één hand' : 'op één of twee handen';

  if (variantInfo.minFingers === 1 && variantInfo.maxFingers === 10) {
    return `Tel het aantal vingers ${handText}.`;
  }

  const rangeText =
    variantInfo.minFingers === variantInfo.maxFingers
      ? `${variantInfo.minFingers}`
      : `${variantInfo.minFingers} tot en met ${variantInfo.maxFingers}`;

  return `Tel het aantal vingers ${handText} (${rangeText}).`;
}

export function getHowManyFingersGameVariant(
  variant: string,
): HowManyFingersGameExtendedVariantInfo {
  const variantInfo = howManyFingersGameVariants[variant] || defaultVariant;

  const mainCode = determineMainCode();
  const description = createDescription(variantInfo);

  return { ...variantInfo, mainCode, description };
}
