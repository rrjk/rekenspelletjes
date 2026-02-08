import { expect, test } from '@jest/globals';
import { CreateMinusSum, CreatePlusSum } from './SumCreationHelpers';

/** Number of iterations to believe random answers comply */
const numberIterations = 100; // 100 is enough for regression, use 1000 to test in case of progression

function testCreateMinusSumNoSplit(
  min: number,
  max: number,
  lowestTenJump: number,
  highestTenJump: number,
  exclude: number,
): void {
  const ret = CreateMinusSum(
    min,
    max,
    lowestTenJump,
    highestTenJump,
    'noSplit',
    exclude,
  );
  expect(ret.leftOperand).toBeGreaterThan(min);
  expect(ret.leftOperand).toBeLessThan(max);
  expect(ret.rightOperand).toBeGreaterThanOrEqual(lowestTenJump * 10 + 1);
  expect(ret.rightOperand).toBeLessThanOrEqual(highestTenJump * 10 + 9);
  expect(ret.rightOperand).not.toBe(exclude);
  expect(ret.answer).toBe(ret.leftOperand - ret.rightOperand);
  expect(ret.answer).toBeGreaterThan(min);
  expect(ret.answer).toBeLessThan(max);
  const singlesInLeftOperandOrTen =
    ret.leftOperand % 10 === 0 ? 10 : ret.leftOperand % 10;
  expect(singlesInLeftOperandOrTen).toBeGreaterThanOrEqual(
    ret.rightOperand % 10,
  );
}

function testCreateMinusSumWithSplit(
  min: number,
  max: number,
  lowestTenJump: number,
  highestTenJump: number,
  exclude: number,
): void {
  const ret = CreateMinusSum(
    min,
    max,
    lowestTenJump,
    highestTenJump,
    'split',
    exclude,
  );
  expect(ret.leftOperand).toBeGreaterThan(min);
  expect(ret.leftOperand).toBeLessThan(max);
  expect(ret.rightOperand).toBeGreaterThanOrEqual(lowestTenJump * 10 + 1);
  expect(ret.rightOperand).toBeLessThanOrEqual(highestTenJump * 10 + 9);
  expect(ret.rightOperand).not.toBe(exclude);
  expect(ret.answer).toBe(ret.leftOperand - ret.rightOperand);
  expect(ret.answer).toBeGreaterThan(min);
  expect(ret.answer).toBeLessThan(max);
  expect((ret.leftOperand % 10) - (ret.rightOperand % 10)).toBeLessThan(0);
}

function testCreatePlusSumNoSplit(
  min: number,
  max: number,
  lowestTenJump: number,
  highestTenJump: number,
  exclude: number,
): void {
  const ret = CreatePlusSum(
    min,
    max,
    lowestTenJump,
    highestTenJump,
    'noSplit',
    exclude,
  );
  expect(ret.leftOperand).toBeGreaterThan(min);
  expect(ret.leftOperand).toBeLessThan(max);
  expect(ret.answer).toBeGreaterThan(min);
  expect(ret.answer).toBeLessThan(max);
  expect(ret.rightOperand).toBeGreaterThanOrEqual(lowestTenJump * 10 + 1);
  expect(ret.rightOperand).toBeLessThanOrEqual(highestTenJump * 10 + 9);
  expect(ret.rightOperand % 10).not.toBe(exclude);
  expect(ret.answer).toBe(ret.leftOperand + ret.rightOperand);
  expect((ret.leftOperand % 10) + (ret.rightOperand % 10)).toBeLessThanOrEqual(
    10,
  );
}

function testCreatePlusSumWithSplit(
  min: number,
  max: number,
  lowestTenJump: number,
  highestTenJump: number,
  exclude: number,
): void {
  const ret = CreatePlusSum(
    min,
    max,
    lowestTenJump,
    highestTenJump,
    'split',
    exclude,
  );
  expect(ret.leftOperand).toBeGreaterThan(min);
  expect(ret.leftOperand).toBeLessThan(max);
  expect(ret.rightOperand).toBeGreaterThanOrEqual(lowestTenJump * 10 + 1);
  expect(ret.rightOperand).toBeLessThanOrEqual(highestTenJump * 10 + 9);
  expect(ret.rightOperand).not.toBe(exclude);
  expect(ret.answer).toBe(ret.leftOperand + ret.rightOperand);
  expect(ret.answer).toBeGreaterThan(min);
  expect(ret.answer).toBeLessThan(max);
  expect(
    (ret.leftOperand % 10) + (ret.rightOperand % 10),
  ).toBeGreaterThanOrEqual(10);
}

describe(`Assertions raised in CreateMinusSum with no splits`, () => {
  test(`, when min max for numberline switched`, () => {
    expect(() => CreateMinusSum(40, 20, 1, 2, 'noSplit', 9)).toThrow();
  });
  test(`, when min not a multiple of 10 `, () => {
    expect(() => CreateMinusSum(45, 20, 1, 2, 'noSplit', 9)).toThrow();
  });
  test(`, when numberline too short`, () => {
    expect(() => CreateMinusSum(0, 10, 1, 2, 'noSplit', 9)).toThrow();
  });
  test(`, when a non single provided as exclusion parameter`, () => {
    expect(() => CreateMinusSum(0, 20, 0, 0, 'noSplit', 12)).toThrow();
  });
});

describe('Assertions raised in CreateMinusSum with splits', () => {
  test(`, when min max for numberline switched`, () => {
    expect(() => CreateMinusSum(40, 20, 1, 2, 'split', 9)).toThrow();
  });
  test(`, when min not a multiple of 10 `, () => {
    expect(() => CreateMinusSum(45, 20, 1, 2, 'split', 9)).toThrow();
  });
  test(`, when numberline too short`, () => {
    expect(() => CreateMinusSum(0, 20, 1, 2, 'split', 9)).toThrow();
  });
  test(`, when a non single provided as exclusion parameter`, () => {
    expect(() => CreateMinusSum(0, 20, 0, 0, 'split', 12)).toThrow();
  });
});

describe('Postconditions always met for CreateMinusSum with no splits, ', () => {
  test(`no ten jumps and a numberline from 30-80.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumNoSplit(30, 80, 0, 0, j % 10);
    }
  });

  test(`no ten jumps and a numberline from 0-10.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumNoSplit(0, 10, 0, 0, j % 10);
    }
  });

  test(`no ten jumps and a numberline from 10-20.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumNoSplit(10, 20, 0, 0, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 30-80.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumNoSplit(30, 80, 0, 2, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 0-20.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumNoSplit(0, 20, 0, 1, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 0-20, where the max number of ten jumps is specified higher than possible.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumNoSplit(0, 20, 0, 2, j % 10);
    }
  });
});

describe('Postconditions always met for CreateMinusSum with splits, ', () => {
  test(`with no ten jumps and a numberline from 30-80.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumWithSplit(30, 80, 0, 0, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 30-80, where number of ten jumps is specified way to high.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumWithSplit(30, 80, 1, 100, j % 10);
    }
  });

  test(`with no ten jumps and a numberline from 0-20.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumWithSplit(0, 20, 0, 0, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 0-30.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreateMinusSumWithSplit(10, 30, 0, 1, j % 10);
    }
  });
});

describe(`Assertions raised in CreatePlusSum with no splits`, () => {
  test(`, when min max for numberline switched`, () => {
    expect(() => CreatePlusSum(40, 20, 1, 2, 'noSplit', 9)).toThrow();
  });
  test(`, when min not a multiple of 10 `, () => {
    expect(() => CreatePlusSum(45, 20, 1, 2, 'noSplit', 9)).toThrow();
  });
  test(`, when numberline too short`, () => {
    expect(() => CreatePlusSum(0, 10, 1, 2, 'noSplit', 9)).toThrow();
  });
  test(`, when a non single provided as exclusion parameter`, () => {
    expect(() => CreatePlusSum(0, 20, 0, 0, 'noSplit', 12)).toThrow();
  });
});

describe('Assertions raised in CreatePlusSum with splits', () => {
  test(`, when min max for numberline switched`, () => {
    expect(() => CreatePlusSum(40, 20, 1, 2, 'split', 9)).toThrow();
  });
  test(`, when min not a multiple of 10 `, () => {
    expect(() => CreatePlusSum(45, 20, 1, 2, 'split', 9)).toThrow();
  });
  test(`, when numberline too short`, () => {
    expect(() => CreatePlusSum(0, 20, 1, 2, 'split', 9)).toThrow();
  });
  test(`, when a non single provided as exclusion parameter`, () => {
    expect(() => CreatePlusSum(0, 20, 0, 0, 'split', 12)).toThrow();
  });
});

describe('Postconditions always met for CreatePlusSum with no splits, ', () => {
  test(`no ten jumps and a numberline from 30-80.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumNoSplit(30, 80, 0, 0, j % 10);
    }
  });

  test(`no ten jumps and a numberline from 0-10.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumNoSplit(0, 10, 0, 0, j % 10);
    }
  });

  test(`no ten jumps and a numberline from 10-20.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumNoSplit(10, 20, 0, 0, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 30-80.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumNoSplit(30, 80, 0, 2, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 0-20.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumNoSplit(0, 20, 0, 1, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 0-20, where the max number of ten jumps is specified higher than possible.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumNoSplit(0, 20, 0, 2, j % 10);
    }
  });
});

describe('Postconditions always met for CreatePlusSum with splits, ', () => {
  test(`with no ten jumps and a numberline from 30-80.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumWithSplit(30, 80, 0, 0, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 30-80, where number of ten jumps is specified way to high.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumWithSplit(30, 80, 1, 100, j % 10);
    }
  });

  test(`with no ten jumps and a numberline from 0-20.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumWithSplit(0, 20, 0, 0, j % 10);
    }
  });

  test(`with ten jumps and a numberline from 0-30.`, () => {
    for (let j = 0; j < numberIterations; j++) {
      testCreatePlusSumWithSplit(10, 30, 0, 1, j % 10);
    }
  });
});
