import {
  getDotCountingGameVariant,
  dotCountingGameVariants,
  type DotCountingGameExtendedVariantInfo,
} from './DotCountingGameVariants';

test('dotCountingGameVariants has expected keys', () => {
  expect(Object.keys(dotCountingGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
  ]);
});

test('getDotCountingGameVariant for aa', () => {
  const extendedVariant = getDotCountingGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.countOnly).toBe(true);
  expect(extendedVariant.includeDifference).toBe(false);
  expect(extendedVariant.maxDifference).toBe(9);
  expect(extendedVariant.mainCode).toBe('O');
  expect(extendedVariant.description).toBe('Tel de stippen');
});

test('getDotCountingGameVariant for ab', () => {
  const extendedVariant = getDotCountingGameVariant('ab');
  expect(extendedVariant.iconColor).toBe('orange');
  expect(extendedVariant.countOnly).toBe(false);
  expect(extendedVariant.includeDifference).toBe(false);
  expect(extendedVariant.maxDifference).toBe(9);
  expect(extendedVariant.mainCode).toBe('O');
  expect(extendedVariant.description).toBe('Welke hand heeft meer stippen?');
});

test('getDotCountingGameVariant for ac', () => {
  const extendedVariant = getDotCountingGameVariant('ac');
  expect(extendedVariant.iconColor).toBe('yellow');
  expect(extendedVariant.countOnly).toBe(false);
  expect(extendedVariant.includeDifference).toBe(true);
  expect(extendedVariant.maxDifference).toBe(9);
  expect(extendedVariant.mainCode).toBe('O');
  expect(extendedVariant.description).toBe(
    'Welke hand heeft meer stippen? Hoeveel stippen meer?',
  );
});

test('getDotCountingGameVariant for unknown variant returns default', () => {
  const extendedVariant = getDotCountingGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.countOnly).toBe(true);
  expect(extendedVariant.includeDifference).toBe(false);
});

test('DotCountingGameExtendedVariantInfo type validation', () => {
  const variant: DotCountingGameExtendedVariantInfo =
    getDotCountingGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.countOnly).toBe('boolean');
  expect(typeof variant.includeDifference).toBe('boolean');
  expect(typeof variant.maxDifference).toBe('number');
});
