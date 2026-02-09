import { getRange } from './NumberHelperFunctions';
import { randomFromSet, randomIntFromRange } from './Randomizer';
import { UnexpectedValueError } from './UnexpectedValueError';

export interface LeftRightOperandType {
  leftOperand: number;
  rightOperand: number;
  answer: number;
}

type Split = 'noSplit' | 'split';

/* Create a minus sum, optionally with  jumps of 10 and optionally with splits
 * Minimum and maximum are prevented
 * @param min - minimum number on the numberline
 * @param max - maximum number on the numberline
 * @param lowestTenJump - What is the lowest multiple of 10 jump allowed (express as e.g. 2 for jumps of 20)
 * @param highestTenJump - What is the highest multiple of 10 jump allowed (express as e.g. 2 for jumps of 20)
 * @param split - Is a split needed
 * @param excludedRightOperand - which single (1-9) should be execluded as right operand (undefined if none need to be excluded
 *
 */
export function CreateMinusSum(
  min: number,
  max: number,
  lowestTensJump: number,
  highestTensJump: number,
  split: Split,
  excludedSinglesRightOperand: undefined | number,
  excludeMin = true,
): LeftRightOperandType {
  if (min % 10 !== 0 || max % 10 !== 0)
    throw new RangeError(
      `One of the arguments (${min}, ${max} is not a multiple of 10`,
    );
  if (min >= max) throw new RangeError(`Min (${min}) >= Max (${max})`);
  if (lowestTensJump > highestTensJump)
    throw new RangeError(
      `lowestTensJump (${lowestTensJump}) > highestTensJump (${highestTensJump})`,
    );
  if (
    excludedSinglesRightOperand !== undefined &&
    (excludedSinglesRightOperand < 0 || excludedSinglesRightOperand > 9)
  )
    throw new RangeError(
      `excludedSinglesRightOperand ${excludedSinglesRightOperand} is not a single`,
    );

  const tensInMin = min / 10;
  const tensInMax = max / 10;

  const additionalTenJumpDueToSplit = split === 'noSplit' ? 0 : 1;

  if (tensInMax - tensInMin < lowestTensJump + 1 + additionalTenJumpDueToSplit)
    throw new RangeError(`Numberline isn't long enough`);

  const highestAllowedTensJump = Math.min(
    tensInMax - tensInMin - (1 + additionalTenJumpDueToSplit),
    highestTensJump,
  );

  /** First we determine the number of tens in the right operand
   */
  const tensInRightOperand = randomIntFromRange(
    lowestTensJump,
    highestAllowedTensJump,
  );

  /** Then we determine the number of tens in the left operand
   */
  const tensInLeftOperand = randomIntFromRange(
    tensInMin + tensInRightOperand + additionalTenJumpDueToSplit,
    tensInMax - 1,
  );

  /** The we determine the number of singles in the right operand
   */
  let minSinglesInRightOperand = -1;
  let maxSinglesInRightOperand = -1;
  switch (split) {
    case 'noSplit':
      minSinglesInRightOperand = 1;
      maxSinglesInRightOperand = 9;
      if (excludeMin && tensInLeftOperand - tensInRightOperand === tensInMin) {
        /* If the right operand would be 9, we can only end up on the minimum, which is not allowed */
        maxSinglesInRightOperand = 8;
      }
      break;
    case 'split':
      /** The we determine the number of singles in the right operand
       */
      minSinglesInRightOperand = 2;
      maxSinglesInRightOperand = 9;
      break;
    default:
      throw new UnexpectedValueError(split);
  }

  const allowedSinglesInRightOperand = getRange(
    minSinglesInRightOperand,
    maxSinglesInRightOperand,
  ).filter(e => e !== excludedSinglesRightOperand);
  const singlesInRightOperand = randomFromSet(allowedSinglesInRightOperand);

  /** Finally we need to determine the number of singles in the left operand
   */
  let minSinglesInLeftOperand = -1;
  let maxSinglesInLeftOperand = -1;

  switch (split) {
    case 'noSplit':
      minSinglesInLeftOperand = 0;
      maxSinglesInLeftOperand = 9;
      if (excludeMin && tensInLeftOperand - tensInRightOperand === tensInMin)
        /* To prevent ending up at the min of the numberline, the singles in the left operand need to be more the singles in the right operand */
        minSinglesInLeftOperand = singlesInRightOperand + 1;
      else
        /* Otherwise equal to the singles in the right operand is good enough as we'd end up on a whole of ten in between */
        minSinglesInLeftOperand = singlesInRightOperand;
      break;
    case 'split':
      minSinglesInLeftOperand = 1;
      maxSinglesInLeftOperand = singlesInRightOperand - 1;
      break;
    default:
      throw new UnexpectedValueError(split);
  }

  const singlesInLeftOperand = randomIntFromRange(
    minSinglesInLeftOperand,
    maxSinglesInLeftOperand,
  );

  const leftOperand = tensInLeftOperand * 10 + singlesInLeftOperand;
  const rightOperand = tensInRightOperand * 10 + singlesInRightOperand;
  const answer = leftOperand - rightOperand;

  return {
    leftOperand,
    rightOperand,
    answer,
  };
}

/* Create a plus sum, optionally with  jumps of 10 and optionally with splits
 * Minimum and maximum are prevented
 * @param min - minimum number on the numberline
 * @param max - maximum number on the numberline
 * @param lowestTenJump - What is the lowest multiple of 10 jump allowed (express as e.g. 2 for jumps of 20)
 * @param highestTenJump - What is the highest multiple of 10 jump allowed (express as e.g. 2 for jumps of 20)
 * @param split - Is a split needed
 * @param excludedRightOperand - which singles (1-9) should be execluded as right operand (undefined if none need to be excluded)
 *
 */
export function CreatePlusSum(
  min: number,
  max: number,
  lowestTensJump: number,
  highestTensJump: number,
  split: Split,
  excludedSinglesRightOperand: number | undefined,
  excludeMin = true,
  excludeMax = true,
): LeftRightOperandType {
  if (min % 10 !== 0 || max % 10 !== 0)
    throw new RangeError(
      `One of the arguments (${min}, ${max} is not a multiple of 10`,
    );
  if (min >= max) throw new RangeError(`Min (${min}) >= Max (${max})`);
  if (lowestTensJump > highestTensJump)
    throw new RangeError(
      `lowestTensJump (${lowestTensJump}) > highestTensJump (${highestTensJump})`,
    );
  if (
    excludedSinglesRightOperand !== undefined &&
    (excludedSinglesRightOperand < 0 || excludedSinglesRightOperand > 9)
  )
    throw new RangeError(
      `excludedSinglesRightOperand ${excludedSinglesRightOperand} is not a single`,
    );

  const tensInMin = min / 10;
  const tensInMax = max / 10;

  const additionalTenJumpDueToSplit = split === 'noSplit' ? 0 : 1;

  if (tensInMax - tensInMin < lowestTensJump + 1 + additionalTenJumpDueToSplit)
    throw new RangeError(`Numberline isn't long enough`);

  const highestAllowedTensJump = Math.min(
    tensInMax - tensInMin - (1 + additionalTenJumpDueToSplit),
    highestTensJump,
  );

  /** First we determine the number of tens in the right operand
   */
  const tensInRightOperand = randomIntFromRange(
    lowestTensJump,
    highestAllowedTensJump,
  );

  /** Then we determine the number of tens in the left operand
   */
  const tensInLeftOperand = randomIntFromRange(
    tensInMin,
    tensInMax - 1 - tensInRightOperand - additionalTenJumpDueToSplit,
  );

  /** The we determine the number of singles in the right operand
   */
  let minSinglesInRightOperand = -1;
  let maxSinglesInRightOperand = -1;
  switch (split) {
    case 'noSplit':
      minSinglesInRightOperand = 1;
      maxSinglesInRightOperand = 9;
      if (
        excludeMax &&
        tensInLeftOperand + tensInRightOperand === tensInMax - 1
      ) {
        /* If the right operand would be 9, we can only end up on the maxinum, which is not allowed */
        maxSinglesInRightOperand = 8;
      }
      break;
    case 'split':
      /** The we determine the number of singles in the right operand
       */
      minSinglesInRightOperand = 2;
      maxSinglesInRightOperand = 9;
      break;
    default:
      throw new UnexpectedValueError(split);
  }

  const allowedSinglesInRightOperand = getRange(
    minSinglesInRightOperand,
    maxSinglesInRightOperand,
  ).filter(e => e !== excludedSinglesRightOperand); // This also works fine with excludedSinglesRightOperand being undefined
  const singlesInRightOperand = randomFromSet(allowedSinglesInRightOperand);

  /** Finally we need to determine the number of singles in the left operand
   */
  let minSinglesInLeftOperand = -1;
  let maxSinglesInLeftOperand = -1;

  switch (split) {
    case 'noSplit':
      minSinglesInLeftOperand = 0;
      maxSinglesInLeftOperand = 9;
      if (
        excludeMax &&
        tensInLeftOperand + tensInRightOperand + 1 === tensInMax
      )
        /* To prevent ending up at the max of the numberline, the singles in the left operand plus the singles in the right operand may not add up to 10*/
        maxSinglesInLeftOperand = 9 - singlesInRightOperand;
      else
        /* Otherwise the may edd up to 10  */
        maxSinglesInLeftOperand = 10 - singlesInRightOperand;
      if (excludeMin && tensInLeftOperand === tensInMin) {
        /* To prevent min being the min of the numberline, the singles in the left operand may not be 0 */
        minSinglesInLeftOperand = 1;
      }
      break;
    case 'split':
      minSinglesInLeftOperand = 11 - singlesInRightOperand;
      maxSinglesInLeftOperand = 9;
      break;
    default:
      throw new UnexpectedValueError(split);
  }

  const singlesInLeftOperand = randomIntFromRange(
    minSinglesInLeftOperand,
    maxSinglesInLeftOperand,
  );

  const leftOperand = tensInLeftOperand * 10 + singlesInLeftOperand;
  const rightOperand = tensInRightOperand * 10 + singlesInRightOperand;
  const answer = leftOperand + rightOperand;

  return {
    leftOperand,
    rightOperand,
    answer,
  };
}
