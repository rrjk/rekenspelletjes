import { expect, test } from '@jest/globals';
import {
  randomMinusSumWithoutSplit,
  type Sum,
  type AdditionSubstractionParameters,
  minusSumWithoutSplit,
  minusSumWithSplit,
  plusSumWithoutSplit,
  plusSumWithSplit,
  randomMinusSumWithSplit,
  randomPlusSumWithoutSplit,
  randomPlusSumWithSplit,
} from './SumCreationHelpersV2';

import { inRange } from './NumberHelperFunctions';

/** Number of iterations to believe random answers comply */
const numberIterations = 1000; // 100 is enough for regression, use 1000 to test in case of progression

function testPostconditionsCreateMinusSumWithoutSplit(
  params: AdditionSubstractionParameters,
  result: Sum,
): void {
  // Check that the answer is correct
  expect(result.leftOperand - result.rightOperand).toBe(result.answer);
  expect(inRange(params.leftRange, result.leftOperand)).toBe(true);
  expect(inRange(params.rightRange, result.rightOperand)).toBe(true);
  expect(inRange(params.answerRange, result.answer)).toBe(true);
  expect(
    minusSumWithoutSplit.isValid(result.leftOperand, result.rightOperand),
  ).toBe(true);
}

function testPostconditionsCreateMinusSumWithSplit(
  params: AdditionSubstractionParameters,
  result: Sum,
): void {
  // Check that the answer is correct
  expect(result.leftOperand - result.rightOperand).toBe(result.answer);
  expect(inRange(params.leftRange, result.leftOperand)).toBe(true);
  expect(inRange(params.rightRange, result.rightOperand)).toBe(true);
  expect(inRange(params.answerRange, result.answer)).toBe(true);
  expect(
    minusSumWithSplit.isValid(result.leftOperand, result.rightOperand),
  ).toBe(true);
}

function testPostconditionsCreatePlusSumWithSplit(
  params: AdditionSubstractionParameters,
  result: Sum,
): void {
  // Check that the answer is correct
  expect(result.leftOperand + result.rightOperand).toBe(result.answer);
  expect(inRange(params.leftRange, result.leftOperand)).toBe(true);
  expect(inRange(params.rightRange, result.rightOperand)).toBe(true);
  expect(inRange(params.answerRange, result.answer)).toBe(true);
  expect(
    plusSumWithSplit.isValid(result.leftOperand, result.rightOperand),
  ).toBe(true);
}

function testPostconditionsCreatePlusSumWithoutSplit(
  params: AdditionSubstractionParameters,
  result: Sum,
): void {
  // Check that the answer is correct
  expect(result.leftOperand + result.rightOperand).toBe(result.answer);
  expect(inRange(params.leftRange, result.leftOperand)).toBe(true);
  expect(inRange(params.rightRange, result.rightOperand)).toBe(true);
  expect(inRange(params.answerRange, result.answer)).toBe(true);
  expect(
    plusSumWithoutSplit.isValid(result.leftOperand, result.rightOperand),
  ).toBe(true);
}

describe('Test validity functions', () => {
  test(`PlusWithoutSplit, 5+3`, () => {
    expect(plusSumWithoutSplit.isValid(5, 3)).toBe(true);
  });
  test(`PlusWithoutSplit, 34+0`, () => {
    expect(plusSumWithoutSplit.isValid(34, 0)).toBe(true);
  });
  test(`PlusWithoutSplit, 58+2`, () => {
    expect(plusSumWithoutSplit.isValid(58, 2)).toBe(true);
  });
  test(`PlusWithoutSplit, 30+9`, () => {
    expect(plusSumWithoutSplit.isValid(30, 9)).toBe(true);
  });
  test(`PlusWithoutSplit, 30+10`, () => {
    expect(plusSumWithoutSplit.isValid(30, 10)).toBe(true);
  });
  test(`PlusWithoutSplit, 109+2`, () => {
    expect(plusSumWithoutSplit.isValid(109, 2)).toBe(false);
  });
  test(`PlusWithoutSplit, 12+9`, () => {
    expect(plusSumWithoutSplit.isValid(12, 9)).toBe(false);
  });

  test(`PlusWithSplit, 5+3`, () => {
    expect(plusSumWithSplit.isValid(5, 3)).toBe(false);
  });
  test(`PlusWithSplit, 34+0`, () => {
    expect(plusSumWithSplit.isValid(34, 0)).toBe(false);
  });
  test(`PlusWithSplit, 58+2`, () => {
    expect(plusSumWithSplit.isValid(58, 2)).toBe(false);
  });
  test(`PlusWithSplit, 30+9`, () => {
    expect(plusSumWithSplit.isValid(30, 9)).toBe(false);
  });
  test(`PlusWithSplit, 30+10`, () => {
    expect(plusSumWithSplit.isValid(30, 10)).toBe(false);
  });
  test(`PlusWithSplit, 109+2`, () => {
    expect(plusSumWithSplit.isValid(109, 2)).toBe(true);
  });
  test(`PlusWithSplit, 12+9`, () => {
    expect(plusSumWithSplit.isValid(12, 9)).toBe(true);
  });
  test(`PlusWithSplit, 1+9`, () => {
    expect(plusSumWithSplit.isValid(1, 9)).toBe(false);
  });

  test(`MinusWithoutSplit, 5-3`, () => {
    expect(minusSumWithoutSplit.isValid(5, 3)).toBe(true);
  });
  test(`MinusWithoutSplit, 34-0`, () => {
    expect(minusSumWithoutSplit.isValid(34, 0)).toBe(true);
  });
  test(`MinusWithoutSplit, 34-10`, () => {
    expect(minusSumWithoutSplit.isValid(34, 10)).toBe(true);
  });
  test(`MinusWithoutSplit, 58-8`, () => {
    expect(minusSumWithoutSplit.isValid(58, 8)).toBe(true);
  });
  test(`MinusWithoutSplit, 30-9`, () => {
    expect(minusSumWithoutSplit.isValid(30, 9)).toBe(true);
  });
  test(`MinusWithoutSplit, 103-4`, () => {
    expect(minusSumWithoutSplit.isValid(103, 4)).toBe(false);
  });
  test(`MinusWithoutSplit, 12-9`, () => {
    expect(minusSumWithoutSplit.isValid(12, 9)).toBe(false);
  });
  test(`MinusWithSplit, 5-3`, () => {
    expect(minusSumWithSplit.isValid(5, 3)).toBe(false);
  });
  test(`MinusWithSplit, 34-0`, () => {
    expect(minusSumWithSplit.isValid(34, 0)).toBe(false);
  });
  test(`MinusWithSplit, 34-10`, () => {
    expect(minusSumWithSplit.isValid(34, 10)).toBe(false);
  });
  test(`MinusWithSplit, 58-8`, () => {
    expect(minusSumWithSplit.isValid(58, 8)).toBe(false);
  });
  test(`MinusWithSplit, 30-9`, () => {
    expect(minusSumWithSplit.isValid(30, 9)).toBe(false);
  });
  test(`MinusWithSplit, 103-4`, () => {
    expect(minusSumWithSplit.isValid(103, 4)).toBe(true);
  });
  test(`MinusWithSplit, 12-9`, () => {
    expect(minusSumWithSplit.isValid(12, 9)).toBe(true);
  });
});

describe('randomMinusSumWithoutSplit', () => {
  test('Range left 0-10, answer 0-10, right 0-9, no split - sums like 7-5', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(10).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11).fill(true, 0, 11);
    const expectedRightOperands = Array(11).fill(true, 0, 10);
    const expectedAnswers = Array(11).fill(true, 0, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 0, max: 10 },
        rightRange: { min: 0, max: 9 },
        answerRange: { min: 0, max: 10 },
      };
      const result: Sum = randomMinusSumWithoutSplit(params);
      testPostconditionsCreateMinusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
  test('Range left 10-20, answer 10-20, right 0-9, no split - sums like 17-5', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(10).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11).fill(true, 0, 11);
    const expectedRightOperands = Array(11).fill(true, 0, 10);
    const expectedAnswers = Array(11).fill(true, 0, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 10, max: 20 },
        rightRange: { min: 0, max: 9 },
        answerRange: { min: 10, max: 20 },
      };
      const result: Sum = randomMinusSumWithoutSplit(params);
      testPostconditionsCreateMinusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand - 10] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer - 10] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
  test('Range left 11-20, answer 10, right 1-10, no split - sums like 16 - .. = 10', () => {
    const leftOperands = Array(10).fill(false);
    const rightOperands = Array(10).fill(false);
    const answers = Array(1).fill(false);

    const expectedLeftOperands = Array(10).fill(true, 0, 10);
    const expectedRightOperands = Array(10).fill(true, 0, 10);
    const expectedAnswers = Array(1).fill(true);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 11, max: 20 },
        rightRange: { min: 1, max: 10 },
        answerRange: { min: 10, max: 10 },
      };
      const result: Sum = randomMinusSumWithoutSplit(params);
      testPostconditionsCreateMinusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand - 11] = true;
      rightOperands[result.rightOperand - 1] = true;
      answers[result.answer - 10] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
  test(`Range left 10, answer 0-10, right 0-9, no split - sums like 10-2`, () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(10).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11)
      .fill(false, 0, 10)
      .fill(true, 10, 11);
    const expectedRightOperands = Array(10).fill(true, 0, 10);
    const expectedAnswers = Array(11).fill(false, 0, 1).fill(true, 1, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 10, max: 10 },
        rightRange: { min: 0, max: 9 },
        answerRange: { min: 0, max: 10 },
      };
      const result: Sum = randomMinusSumWithoutSplit(params);
      testPostconditionsCreateMinusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
  test('Range left 15-25, answer 11-21, right 0-9, no split', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(10).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11).fill(true, 0, 11);
    const expectedRightOperands = Array(10).fill(true, 0, 10);
    const expectedAnswers = Array(11).fill(true, 0, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 15, max: 25 },
        rightRange: { min: 0, max: 9 },
        answerRange: { min: 11, max: 21 },
      };
      const result: Sum = randomMinusSumWithoutSplit(params);
      testPostconditionsCreateMinusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand - 15] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer - 11] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
});

describe('randomMinusSumWithSplit', () => {
  test('Range left 10-20, answer 0-10, right 0-9, with split - sums like 16-8', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(10).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11)
      .fill(false, 0, 1)
      .fill(true, 1, 9)
      .fill(false, 9, 11);
    const expectedRightOperands = Array(10).fill(false, 0, 2).fill(true, 2, 10);
    const expectedAnswers = Array(11)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 10, max: 20 },
        rightRange: { min: 0, max: 9 },
        answerRange: { min: 0, max: 10 },
      };
      const result: Sum = randomMinusSumWithSplit(params);
      testPostconditionsCreateMinusSumWithSplit(params, result);
      leftOperands[result.leftOperand - 10] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
});

describe('randomMinusSumWithSplit', () => {
  test('Range left 50-70, answer 20-40, right 20-40, with split - sums like 56-28', () => {
    const leftOperands = Array(21).fill(false);
    const rightOperands = Array(21).fill(false);
    const answers = Array(21).fill(false);

    const expectedLeftOperands = Array(21)
      .fill(false, 0, 1)
      .fill(true, 1, 9)
      .fill(false, 9, 11)
      .fill(true, 11, 19)
      .fill(false, 19, 21);
    const expectedRightOperands = Array(21)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 12)
      .fill(true, 12, 20)
      .fill(false, 20, 21);
    const expectedAnswers = Array(21)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 12)
      .fill(true, 12, 20)
      .fill(false, 20, 21);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 50, max: 70 },
        rightRange: { min: 20, max: 40 },
        answerRange: { min: 20, max: 50 },
      };
      const result: Sum = randomMinusSumWithSplit(params);
      testPostconditionsCreateMinusSumWithSplit(params, result);
      leftOperands[result.leftOperand - 50] = true;
      rightOperands[result.rightOperand - 20] = true;
      answers[result.answer - 20] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
});

describe('randomPlusSumWithoutSplit', () => {
  test('Range left 0-10, answer 0-10, right 0-10, no split - sums like 3+4', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(11).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11).fill(true, 0, 11);
    const expectedRightOperands = Array(11).fill(true, 0, 11);
    const expectedAnswers = Array(11).fill(true, 0, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 0, max: 10 },
        rightRange: { min: 0, max: 10 },
        answerRange: { min: 0, max: 10 },
      };
      const result: Sum = randomPlusSumWithoutSplit(params);
      testPostconditionsCreatePlusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
  test('Range left 10-20, answer 0-10, right 10-20, no split - sums like 15+2', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(11).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11).fill(true, 0, 11);
    const expectedRightOperands = Array(11).fill(true, 0, 11);
    const expectedAnswers = Array(11).fill(true, 0, 11);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 10, max: 20 },
        rightRange: { min: 0, max: 10 },
        answerRange: { min: 10, max: 20 },
      };
      const result: Sum = randomPlusSumWithoutSplit(params);
      testPostconditionsCreatePlusSumWithoutSplit(params, result);
      leftOperands[result.leftOperand - 10] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer - 10] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
});

describe('randomPlusSumWithSplit', () => {
  test('Range left 0-10, answer 10-20, right 0-10 - sums like 6+8', () => {
    const leftOperands = Array(11).fill(false);
    const rightOperands = Array(11).fill(false);
    const answers = Array(11).fill(false);

    const expectedLeftOperands = Array(11)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 11);
    const expectedRightOperands = Array(11)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 11);
    const expectedAnswers = Array(11)
      .fill(false, 0, 1)
      .fill(true, 1, 9)
      .fill(false, 9, 11);
    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 0, max: 10 },
        rightRange: { min: 0, max: 10 },
        answerRange: { min: 10, max: 20 },
      };
      const result: Sum = randomPlusSumWithSplit(params);
      testPostconditionsCreatePlusSumWithSplit(params, result);
      leftOperands[result.leftOperand] = true;
      rightOperands[result.rightOperand] = true;
      answers[result.answer - 10] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
  test('Range left 50-70, answer 70-90, right 10-20, no split - sums like 56+8', () => {
    const leftOperands = Array(21).fill(false);
    const rightOperands = Array(11).fill(false);
    const answers = Array(21).fill(false);

    const expectedLeftOperands = Array(21)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 12)
      .fill(true, 12, 20)
      .fill(false, 20, 21);
    const expectedRightOperands = Array(11)
      .fill(false, 0, 2)
      .fill(true, 2, 10)
      .fill(false, 10, 11);
    const expectedAnswers = Array(21)
      .fill(false, 0, 1)
      .fill(true, 1, 9)
      .fill(false, 9, 11)
      .fill(true, 11, 19)
      .fill(false, 19, 21);

    for (let i = 0; i < numberIterations; i++) {
      const params: AdditionSubstractionParameters = {
        leftRange: { min: 50, max: 70 },
        rightRange: { min: 10, max: 20 },
        answerRange: { min: 70, max: 90 },
      };
      const result: Sum = randomPlusSumWithSplit(params);
      testPostconditionsCreatePlusSumWithSplit(params, result);
      leftOperands[result.leftOperand - 50] = true;
      rightOperands[result.rightOperand - 10] = true;
      answers[result.answer - 70] = true;
    }
    expect(leftOperands).toEqual(expectedLeftOperands);
    expect(rightOperands).toEqual(expectedRightOperands);
    expect(answers).toEqual(expectedAnswers);
  });
});
