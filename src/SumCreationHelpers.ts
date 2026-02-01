import { getRange } from './NumberHelperFunctions';
import { randomFromSet, randomIntFromRange } from './Randomizer';

export interface LeftRightOperandType {
  leftOperand: number;
  rightOperand: number;
  answer: number;
}

/* Create a minus sum, where we do no jumps of 10 and don't need to do splits
 * @param min - minimum number on the numberline
 * @param max - maximum number on the numberline
 * @param lowestTenJump - What is the lowest multiple of 10 jump allowed (express as e.g. 2 for jumps of 20)
 * @param highestTenJump - What is the highest multiple of 10 jump allowed (express as e.g. 2 for jumps of 20)
 * @param excludedRightOperand - which singles (1-9) should be execluded as right operand
 *
 */
export function CreateMinusSumNoSplit(
  min: number,
  max: number,
  lowestTensJump: number,
  highestTensJump: number,
  excludedSinglesRightOperand: number,
): LeftRightOperandType {
  console.assert(
    min % 10 === 0 && max % 10 === 0,
    `One of the arguments (${min}, ${max} is not a multiple of 10`,
  );
  console.assert(min < max, `Min (${min}) >= Max (${max}))`);
  console.assert(
    lowestTensJump <= highestTensJump,
    `lowestTensJump (${lowestTensJump}) > highestTensJump (${highestTensJump}))`,
  );
  console.assert(
    excludedSinglesRightOperand >= 0 && excludedSinglesRightOperand <= 9,
    `excludedSinglesRightOperand ${excludedSinglesRightOperand} is not a single`,
  );

  const tensInMin = min / 10;
  const tensInMax = max / 10;

  const highestAllowedTensJump = Math.min(
    tensInMax - tensInMin - 1,
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
    tensInMin + tensInRightOperand,
    tensInMax - 1,
  );

  /** The we determine the number of singles in the right operand
   */
  let minSinglesInRightOperand = 1;
  let maxSinglesInRightOperand = 9;
  if (tensInLeftOperand === tensInMin + tensInRightOperand)
    /* If the right operand would be 1, we can only end up on the minimum, which is not allowed */
    minSinglesInRightOperand = 2;
  if (tensInLeftOperand === tensInMax - 1 - tensInRightOperand) {
    /* If the right operand would be 9, we can only end up on the minimum, which is not allowed */
    maxSinglesInRightOperand = 8;
  }
  const allowedSinglesInRightOperand = getRange(
    minSinglesInRightOperand,
    maxSinglesInRightOperand,
  ).filter(e => e !== excludedSinglesRightOperand);
  const singlesInRightOperand = randomFromSet(allowedSinglesInRightOperand);

  /** Finally we need to determine the number of singles in the left operand
   */
  let minSinglesInLeftOperand = 0;
  const maxSinglesInLeftOperand = 9;
  if (tensInLeftOperand === tensInMin + tensInRightOperand)
    /* To prevent ending up at the min of the numberline, the singles in the left operand need to be more the singles in the right operand */
    minSinglesInLeftOperand = singlesInRightOperand + 1;
  else minSinglesInLeftOperand = singlesInRightOperand;
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
