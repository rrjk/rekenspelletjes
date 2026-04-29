import { Color } from '../Colors';

export const fractionPairMatchingGameTypes = [
  'fractionToPie',
  'equalFractions',
  'fractionToDecimal',
  'fractionToPercentage',
  'percentageToDecimal',
  'percentageToPie',
] as const;
export type FractionPairMatchingGameType =
  (typeof fractionPairMatchingGameTypes)[number];

/**
 * Convert a string into a FractionPairMatchingGameType.
 * In case an illegal string is provided, which does not resolve to a game type,
 * fractionToPie is returned.
 *
 * @param value string to convert
 * @returns string converted to a FractionPairMatchingGameType
 */
export function convertFractionPairMatchingGameType(
  value: string | null,
): FractionPairMatchingGameType {
  if (value === null) return 'fractionToPie';
  if (
    fractionPairMatchingGameTypes.includes(
      value as FractionPairMatchingGameType,
    )
  ) {
    return value as FractionPairMatchingGameType;
  }
  return 'fractionToPie';
}

interface FractionsPairMatchingGameVariantInfo {
  iconColor: Color;
  gameType: FractionPairMatchingGameType;
  numberOfPairs: number;
}

const defaultVariant: FractionsPairMatchingGameVariantInfo = {
  iconColor: 'teal',
  gameType: 'fractionToPie',
  numberOfPairs: 10,
};

// Export for testing
export const fractionsPairMatchingGameVariants: Record<
  string,
  FractionsPairMatchingGameVariantInfo
> = {
  aa: { iconColor: 'teal', gameType: 'fractionToPie', numberOfPairs: 10 },
  ab: { iconColor: 'cyan', gameType: 'equalFractions', numberOfPairs: 10 },
  ac: { iconColor: 'blue', gameType: 'fractionToDecimal', numberOfPairs: 10 },
  ad: {
    iconColor: 'purple',
    gameType: 'fractionToPercentage',
    numberOfPairs: 10,
  },
  ae: {
    iconColor: 'lavender',
    gameType: 'percentageToDecimal',
    numberOfPairs: 10,
  },
  af: { iconColor: 'magenta', gameType: 'percentageToPie', numberOfPairs: 10 },
};

export interface FractionsPairMatchingGameExtendedVariantInfo
  extends FractionsPairMatchingGameVariantInfo {
  mainCode: string;
  description: string;
}

function determineMainCode(): string {
  return 'I';
}

function createDescription(
  variantInfo: FractionsPairMatchingGameVariantInfo,
): string {
  const gameTypeDescriptions: Record<FractionPairMatchingGameType, string> = {
    fractionToPie: 'Sleep een breuk over het juiste cirkeldiagram',
    equalFractions:
      'Sleep twee breuken die vereenvoudigd hetzelfde zijn over elkaar heen',
    fractionToDecimal: 'Sleep een breuk over het juiste getal met decimalen',
    fractionToPercentage: 'Sleep een breuk over het juiste percentage',
    percentageToDecimal:
      'Sleep een percentage over het juiste getal met decimalen',
    percentageToPie: 'Sleep een percentage over het juiste cirkeldiagram',
  };
  return gameTypeDescriptions[variantInfo.gameType];
}

export function getFractionsPairMatchingGameVariant(
  variant: string,
): FractionsPairMatchingGameExtendedVariantInfo {
  const variantInfo =
    fractionsPairMatchingGameVariants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
  };
}
