import {
  getFractionsPairMatchingGameVariant,
  fractionsPairMatchingGameVariants,
  type FractionsPairMatchingGameExtendedVariantInfo,
} from './FractionsPairMatchingGameVariants';

test('fractionsPairMatchingGameVariants has expected keys', () => {
  expect(Object.keys(fractionsPairMatchingGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
  ]);
});

test('getFractionsPairMatchingGameVariant for aa', () => {
  const extendedVariant = getFractionsPairMatchingGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('teal');
  expect(extendedVariant.gameType).toBe('fractionToPie');
  expect(extendedVariant.mainCode).toBe('I');
  expect(extendedVariant.description).toBe(
    'Sleep een breuk over het juiste cirkeldiagram',
  );
});

test('getFractionsPairMatchingGameVariant for ab', () => {
  const extendedVariant = getFractionsPairMatchingGameVariant('ab');
  expect(extendedVariant.iconColor).toBe('cyan');
  expect(extendedVariant.gameType).toBe('equalFractions');
  expect(extendedVariant.mainCode).toBe('I');
  expect(extendedVariant.description).toBe(
    'Sleep twee breuken die vereenvoudigd hetzelfde zijn over elkaar heen',
  );
});

test('getFractionsPairMatchingGameVariant for unknown variant returns default', () => {
  const extendedVariant = getFractionsPairMatchingGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('teal');
  expect(extendedVariant.gameType).toBe('fractionToPie');
});

test('FractionsPairMatchingGameExtendedVariantInfo type validation', () => {
  const variant: FractionsPairMatchingGameExtendedVariantInfo =
    getFractionsPairMatchingGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.gameType).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
