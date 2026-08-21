import { NumberRange } from './NumberHelperFunctions';
import { AdditionOperator, Operator } from './Operator';
import { UnexpectedValueError } from './UnexpectedValueError';

export type Sum = {
  leftOperand: number;
  rightOperand: number;
  answer: number;
  operator: Operator;
};

/** Parameters for addition and substraction sums
 */
export type SumRangeParameters = {
  leftRange: NumberRange;
  rightRange: NumberRange;
  answerRange: NumberRange;
};

export type AdditionSubstractionSumParameters = SumRangeParameters & {
  requireSplit: boolean;
  operator: AdditionOperator;
};

type SumRule = {
  /**
   * The simple definition of the educational rule.
   *
   * This is useful for testing and documentation.
   */
  isValid(left: number, right: number): boolean;

  /**
   * Counts the number of valid right operands in the
   * supplied range.
   *
   * This must NOT enumerate the values.
   */
  countValidRights(left: number, rightRange: NumberRange): number;

  /**
   * Returns the nth valid right operand.
   *
   * index is zero-based.
   *
   * This must NOT enumerate all valid values.
   */
  findNthValidRight(
    left: number,
    rightRange: NumberRange,
    index: number,
  ): number;
};

type ArithmeticOperation = {
  calculateAnswer(left: number, right: number): number;

  /**
   * Given a left operand and the allowed answer/right ranges,
   * determine the possible range of right operands.
   */
  getRightRange(
    left: number,
    rightRange: NumberRange,
    answerRange: NumberRange,
  ): NumberRange | null;

  getOperator(): Operator;
};

/* -------------------------------------------------------------------------
 * Generic random sum generator
 * ---------------------------------------------------------------------- */

/**
 * Generates a random arithmetic sum.
 *
 * Every valid (left, right) pair has equal probability.
 *
 * The function only iterates over the possible left operands.
 * It does not enumerate all possible pairs.
 */
function randomArithmeticSum(
  sumParameters: SumRangeParameters,
  /*  leftRange: NumberRange,
  rightRange: NumberRange,
  answerRange: NumberRange,*/
  operation: ArithmeticOperation,
  rule: SumRule,
): Sum {
  /*
   * cumulativeCounts[i] contains the total number of valid
   * sums for all left operands up to and including leftRange.min + i.
   */
  const cumulativeCounts: number[] = [];

  let totalValid = 0;

  for (
    let left = sumParameters.leftRange.min;
    left <= sumParameters.leftRange.max;
    left++
  ) {
    const possibleRights = operation.getRightRange(
      left,
      sumParameters.rightRange,
      sumParameters.answerRange,
    );

    const count =
      possibleRights === null ? 0 : rule.countValidRights(left, possibleRights);

    totalValid += count;
    cumulativeCounts.push(totalValid);
  }

  if (totalValid === 0) {
    throw new Error('No valid sum exists for the given ranges and rule.');
  }

  /*
   * Treat every valid sum as one equally likely item.
   */
  const selection = Math.floor(Math.random() * totalValid);

  /*
   * Find which left operand contains the selected sum.
   * We use binary search here
   */
  let low = 0;
  let high = cumulativeCounts.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);

    if (selection < cumulativeCounts[middle]) {
      high = middle;
    } else {
      low = middle + 1;
    }
  }

  const left = sumParameters.leftRange.min + low;

  /*
   * Convert the global selection into an index within
   * the valid right operands for this particular left.
   */
  const previousCount = low === 0 ? 0 : cumulativeCounts[low - 1];

  const rightIndex = selection - previousCount;

  const possibleRights = operation.getRightRange(
    left,
    sumParameters.rightRange,
    sumParameters.answerRange,
  );

  if (possibleRights === null) {
    throw new Error(
      'Internal error: selected left operand has no right range.',
    );
  }

  const right = rule.findNthValidRight(left, possibleRights, rightIndex);

  const answer = operation.calculateAnswer(left, right);

  return {
    leftOperand: left,
    rightOperand: right,
    answer,
    operator: operation.getOperator(),
  };
}

/* -------------------------------------------------------------------------
 * Arithmetic operations
 * ---------------------------------------------------------------------- */

const subtraction: ArithmeticOperation = {
  calculateAnswer(left, right) {
    return left - right;
  },
  getOperator() {
    return 'minus';
  },

  getRightRange(left, rightRange, answerRange) {
    /*
     * answer = left - right
     *
     * answerRange.min <= left - right <= answerRange.max
     *
     * therefore:
     *
     * left - answerRange.max <= right
     * right <= left - answerRange.min
     */
    const min = Math.max(rightRange.min, left - answerRange.max);

    const max = Math.min(rightRange.max, left - answerRange.min);

    return min <= max ? { min, max } : null;
  },
};

const addition: ArithmeticOperation = {
  calculateAnswer(left, right) {
    return left + right;
  },
  getOperator() {
    return 'plus';
  },

  getRightRange(left, rightRange, answerRange) {
    /*
     * answer = left + right
     *
     * answerRange.min <= left + right <= answerRange.max
     *
     * therefore:
     *
     * answerRange.min - left <= right
     * right <= answerRange.max - left
     */
    const min = Math.max(rightRange.min, answerRange.min - left);

    const max = Math.min(rightRange.max, answerRange.max - left);

    return min <= max ? { min, max } : null;
  },
};

/* -------------------------------------------------------------------------
 * Minus rules
 * ---------------------------------------------------------------------- */

/**
 * A subtraction can be performed without splitting the units
 * of the right operand.
 *
 * Examples:
 *
 *   35 - 12  -> 5 - 2  -> valid
 *   35 - 17  -> 5 - 7  -> invalid
 *
 *   56 - 34  -> 6 - 4  -> valid
 *   56 - 36  -> 6 - 6  -> valid
 *   56 - 38  -> 6 - 8  -> invalid
 *
 * A whole tenfold is a special case:
 *
 *   20 - 8   -> valid
 *   40 - 5   -> valid
 */
export const minusSumWithoutSplit: SumRule = {
  isValid(left, right) {
    const leftUnits = left % 10;
    const rightUnits = right % 10;

    return leftUnits === 0 || rightUnits <= leftUnits;
  },

  countValidRights(left, rightRange) {
    const leftUnits = left % 10;

    /*
     * From a whole tenfold, any units value can be
     * subtracted without splitting.
     */
    if (leftUnits === 0) {
      return rightRange.max - rightRange.min + 1;
    }

    return countNumbersWithUnitsInRange(rightRange, {
      min: 0,
      max: leftUnits,
    });
  },

  findNthValidRight(left, rightRange, index) {
    const leftUnits = left % 10;

    if (leftUnits === 0) {
      return rightRange.min + index;
    }

    return findNthNumberWithUnitsInRange(
      rightRange,
      { min: 0, max: leftUnits },
      index,
    );
  },
};

/**
 * A subtraction requires splitting the units of the
 * right operand.
 *
 * Examples:
 *
 *   35 - 12  -> 5 - 2  -> invalid
 *   35 - 17  -> 5 - 7  -> valid
 *
 *   56 - 34  -> 6 - 4  -> invalid
 *   56 - 38  -> 6 - 8  -> valid
 *
 * A whole tenfold does not require splitting, so:
 *
 *   20 - 8   -> invalid
 *   40 - 5   -> invalid
 */
export const minusSumWithSplit: SumRule = {
  isValid(left, right) {
    const leftUnits = left % 10;
    const rightUnits = right % 10;

    return leftUnits !== 0 && rightUnits > leftUnits;
  },

  countValidRights(left, rightRange) {
    const leftUnits = left % 10;

    /*
     * A whole tenfold never requires splitting.
     */
    if (leftUnits === 0) {
      return 0;
    }

    return countNumbersWithUnitsInRange(rightRange, {
      min: leftUnits + 1,
      max: 9,
    });
  },

  findNthValidRight(left, rightRange, index) {
    const leftUnits = left % 10;

    if (leftUnits === 0) {
      throw new Error('A whole tenfold cannot require a split.');
    }

    return findNthNumberWithUnitsInRange(
      rightRange,
      { min: leftUnits + 1, max: 9 },
      index,
    );
  },
};

/* -------------------------------------------------------------------------
 * Plus rules
 * ---------------------------------------------------------------------- */

/**
 * Addition without splitting.
 *
 * The units can be added directly without producing a carry:
 *
 *   35 + 12 -> 5 + 2 = 7  -> valid
 *   35 + 14 -> 5 + 4 = 9  -> valid
 *   35 + 17 -> 5 + 7 = 12 -> invalid
 */
export const plusSumWithoutSplit: SumRule = {
  isValid(left, right) {
    return (left % 10) + (right % 10) <= 10;
  },

  countValidRights(left, rightRange) {
    const leftUnits = left % 10;

    return countNumbersWithUnitsInRange(rightRange, {
      min: 0,
      max: 10 - leftUnits,
    });
  },

  findNthValidRight(left, rightRange, index) {
    const leftUnits = left % 10;

    return findNthNumberWithUnitsInRange(
      rightRange,
      { min: 0, max: 10 - leftUnits },
      index,
    );
  },
};

/**
 * Addition with splitting.
 *
 * The units cannot be added directly because they produce
 * a carry into the tens:
 *
 *   35 + 17 -> 5 + 7 = 12 -> valid
 *   35 + 12 -> 5 + 2 = 7  -> invalid
 */
export const plusSumWithSplit: SumRule = {
  isValid(left, right) {
    return (left % 10) + (right % 10) > 10;
  },

  countValidRights(left, rightRange) {
    const leftUnits = left % 10;

    return countNumbersWithUnitsInRange(rightRange, {
      min: 11 - leftUnits,
      max: 9,
    });
  },

  findNthValidRight(left, rightRange, index) {
    const leftUnits = left % 10;

    return findNthNumberWithUnitsInRange(
      rightRange,
      { min: 11 - leftUnits, max: 9 },
      index,
    );
  },
};

/* -------------------------------------------------------------------------
 * Public functions
 * ---------------------------------------------------------------------- */

export function randomMinusSumWithoutSplit(
  sumParameters: SumRangeParameters,
): Sum {
  return randomArithmeticSum(sumParameters, subtraction, minusSumWithoutSplit);
}

export function randomMinusSumWithSplit(
  sumParameters: SumRangeParameters,
): Sum {
  return randomArithmeticSum(sumParameters, subtraction, minusSumWithSplit);
}

export function randomPlusSumWithoutSplit(
  sumParameters: SumRangeParameters,
): Sum {
  return randomArithmeticSum(sumParameters, addition, plusSumWithoutSplit);
}

export function randomPlusSumWithSplit(sumParameters: SumRangeParameters): Sum {
  return randomArithmeticSum(sumParameters, addition, plusSumWithSplit);
}

export function randomAdditionSubstractionSum(
  sumParameters: AdditionSubstractionSumParameters,
): Sum {
  if (sumParameters.operator === 'plus') {
    if (sumParameters.requireSplit) {
      return randomPlusSumWithSplit(sumParameters);
    } else {
      return randomPlusSumWithoutSplit(sumParameters);
    }
  } else if (sumParameters.operator === 'minus') {
    if (sumParameters.requireSplit) {
      return randomMinusSumWithSplit(sumParameters);
    } else {
      return randomMinusSumWithoutSplit(sumParameters);
    }
  } else {
    throw new UnexpectedValueError(sumParameters.operator);
  }
}

/* -------------------------------------------------------------------------
 * Numeric helpers
 * ---------------------------------------------------------------------- */

/**
 * Counts numbers in [min, max] whose units digit is between
 * minUnits and maxUnits, inclusive.
 */
function countNumbersWithUnitsInRange(
  range: NumberRange,
  unitsRange: NumberRange,
): number {
  if (range.min > range.max || unitsRange.min > unitsRange.max) {
    return 0;
  }

  return (
    countUpTo(range.max, unitsRange) - countUpTo(range.min - 1, unitsRange)
  );
}

/**
 * Counts numbers from 0 through value whose units digit
 * is between minUnits and maxUnits, inclusive.
 */
function countUpTo(value: number, unitsRange: NumberRange): number {
  if (value < 0) {
    return 0;
  }

  const fullBlocks = Math.floor((value + 1) / 10);

  const remainder = (value + 1) % 10;

  const unitsPerBlock = unitsRange.max - unitsRange.min + 1;

  const unitsInRemainder = Math.max(
    0,
    Math.min(remainder, unitsRange.max + 1) - unitsRange.min,
  );

  return fullBlocks * unitsPerBlock + unitsInRemainder;
}

/**
 * Finds the nth number in [min, max] whose units digit
 * is between minUnits and maxUnits, inclusive.
 *
 * index is zero-based.
 */
function findNthNumberWithUnitsInRange(
  range: NumberRange,
  unitsRange: NumberRange,
  index: number,
): number {
  let low = range.min;
  let high = range.max;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);

    const count = countNumbersWithUnitsInRange(
      { min: range.min, max: middle },
      unitsRange,
    );

    if (count > index) {
      high = middle;
    } else {
      low = middle + 1;
    }
  }

  return low;
}
