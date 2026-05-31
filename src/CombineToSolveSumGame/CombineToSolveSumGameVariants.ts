export interface CombineToSolveSumGameVariantInfo {
  sum: number;
  initialNumberOfPairs: number;
  maxNumberOfPairs: number;
}

export interface CombineToSolveSumGameExtendedVariantInfo
  extends CombineToSolveSumGameVariantInfo {
  mainCode: string;
  description: string;
  iconNumbers: number[];
}

const defaultVariant: CombineToSolveSumGameVariantInfo = {
  sum: 10,
  initialNumberOfPairs: 10,
  maxNumberOfPairs: 20,
};

export const combineToSolveSumGameVariants: Record<
  string,
  CombineToSolveSumGameVariantInfo
> = {
  aa: defaultVariant,
};

function determineMainCode(): string {
  return 'N';
}

function createDescription(
  variantInfo: CombineToSolveSumGameVariantInfo,
): string {
  return `Sleep twee harten over elkaar heen die samen ${variantInfo.sum} maken.`;
}

function createIconNumbers(
  variantInfo: CombineToSolveSumGameVariantInfo,
): number[] {
  const firstNumber = Math.ceil(variantInfo.sum / 4);
  const secondNumber = variantInfo.sum - firstNumber;
  return [firstNumber, secondNumber];
}

export function getCombineToSolveSumGameVariant(
  variant: string,
): CombineToSolveSumGameExtendedVariantInfo {
  const variantInfo =
    combineToSolveSumGameVariants[variant] || combineToSolveSumGameVariants.aa;

  return {
    ...variantInfo,
    mainCode: determineMainCode(),
    description: createDescription(variantInfo),
    iconNumbers: createIconNumbers(variantInfo),
  };
}
