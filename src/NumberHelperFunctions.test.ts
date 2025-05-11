import {
  numberDigitsInNumber,
  numberWithActiveDigits,
  splitInDigits,
} from './NumberHelperFunctions';

test(`number digits 0`, () => {
  expect(numberDigitsInNumber(0)).toBe(1);
});
test(`number digits single digit number != 0`, () => {
  expect(numberDigitsInNumber(5)).toBe(1);
});
test(`number digits two digit number, multiple of 10`, () => {
  expect(numberDigitsInNumber(50)).toBe(2);
});
test(`number digits two digit number, not a multiple of 10`, () => {
  expect(numberDigitsInNumber(79)).toBe(2);
});
test(`number digits five digit number`, () => {
  expect(numberDigitsInNumber(12345)).toBe(5);
});
test(`number digits number with many trailing zeros`, () => {
  expect(numberDigitsInNumber(1000000)).toBe(7);
});

test(`digits for 0`, () => {
  expect(splitInDigits(0)).toStrictEqual([0]);
});

test(`digits single digit number != 0`, () => {
  expect(splitInDigits(5)).toStrictEqual([5]);
});

test(`digits two digit number, not a multiple of 10`, () => {
  expect(splitInDigits(12)).toStrictEqual([1, 2]);
});

test(`digits two digit number, multiple of 10`, () => {
  expect(splitInDigits(20)).toStrictEqual([2, 0]);
});

test(`digits multi digit number`, () => {
  expect(splitInDigits(23456)).toStrictEqual([2, 3, 4, 5, 6]);
});

test(`digits number with many trailing zeros`, () => {
  expect(splitInDigits(10000)).toStrictEqual([1, 0, 0, 0, 0]);
});

test('Number with active digits for 0', () => {
  expect(numberWithActiveDigits(125, 0)).toEqual('');
});

test('Number with active digits - no zeros - 1 active Digit', () => {
  expect(numberWithActiveDigits(125, 1)).toEqual('1');
});

test('Number with active digits - no zeros - 2 active Digits', () => {
  expect(numberWithActiveDigits(125, 2)).toEqual('12');
});

test('Number with active digits - no zeros - max active Digits', () => {
  expect(numberWithActiveDigits(1256, 4)).toEqual('1256');
});

test('Number with active digits - no zeros - more than max active Digits', () => {
  expect(numberWithActiveDigits(1256, 6)).toEqual('1256');
});

test('Number with active digits - trailing zeros - 1 active digit', () => {
  expect(numberWithActiveDigits(1000, 1)).toEqual('1');
});

test('Number with active digits - trailing zeros - 2 active digits', () => {
  expect(numberWithActiveDigits(1000, 2)).toEqual('10');
});

test('Number with active digits - trailing zeros - max active digit', () => {
  expect(numberWithActiveDigits(1000, 4)).toEqual('1000');
});
