import { expect, test } from '@jest/globals';
import { CreateMinusSumNoSplit } from './SumCreationHelpers';

/** Number of iterations to believe random answers comply */
const numberIterations = 1000;

function testCreateMinusSumNoSplit(
  min: number,
  max: number,
  lowestTenJump: number,
  highestTenJump: number,
  exclude: number,
): void {
  const ret = CreateMinusSumNoSplit(min, max, 0, 0, exclude);
  expect(ret.leftOperand).toBeGreaterThan(min);
  expect(ret.leftOperand).toBeLessThan(max);
  expect(ret.answer).toBeGreaterThan(min);
  expect(ret.rightOperand).toBeGreaterThanOrEqual(lowestTenJump * 10 + 1);
  expect(ret.rightOperand).toBeLessThanOrEqual(highestTenJump * 10 + 9);
  expect(ret.rightOperand).not.toBe(exclude);
  expect(ret.answer).toBe(ret.leftOperand - ret.rightOperand);
  expect(ret.answer).toBeGreaterThan(min);
  expect(ret.answer).toBeLessThan(max);
}

test(`Postconditions always met for CreateMinusSumNoSplit 30-80 with no ten jumps`, () => {
  for (let j = 0; j < numberIterations; j++) {
    testCreateMinusSumNoSplit(30, 80, 0, 0, j % 10);
  }
});

test(`Postconditions always met for CreateMinusSumNoSplit 0-10 with no ten jumps`, () => {
  for (let j = 0; j < numberIterations; j++) {
    testCreateMinusSumNoSplit(0, 10, 0, 0, j % 10);
  }
});

test(`Postconditions always met for CreateMinusSumNoSplit 10-20 with no ten jumps`, () => {
  for (let j = 0; j < numberIterations; j++) {
    testCreateMinusSumNoSplit(10, 20, 0, 0, j % 10);
  }
});

test(`Postconditions always met for CreateMinusSumNoSplit 30-80 with ten jumps`, () => {
  for (let j = 0; j < numberIterations; j++) {
    testCreateMinusSumNoSplit(30, 80, 0, 2, j % 10);
  }
});

test(`Postconditions always met for CreateMinusSumNoSplit 0-20 with ten jumps`, () => {
  for (let j = 0; j < numberIterations; j++) {
    testCreateMinusSumNoSplit(0, 20, 0, 1, j % 10);
  }
});

test(`Postconditions always met for CreateMinusSumNoSplit 0-20 with ten jumps, wrong max ten jumps specified`, () => {
  for (let j = 0; j < numberIterations; j++) {
    testCreateMinusSumNoSplit(0, 20, 0, 2, j % 10);
  }
});
