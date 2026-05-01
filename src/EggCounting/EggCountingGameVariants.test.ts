import {
  getEggCountingGameVariant,
  eggCountingGameVariants,
  type EggCountingGameExtendedVariantInfo,
} from './EggCountingGameVariants';

test('eggCountingGameVariants has expected keys', () => {
  expect(Object.keys(eggCountingGameVariants)).toStrictEqual(['aa']);
});

test('getEggCountingGameVariant for aa', () => {
  const extendedVariant = getEggCountingGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('beige');
  expect(extendedVariant.maxNumber).toBe(99);
  expect(extendedVariant.mainCode).toBe('J');
  expect(extendedVariant.description).toBe('Eierdoos tellen');
});

test('getEggCountingGameVariant for unknown variant returns default', () => {
  const extendedVariant = getEggCountingGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('beige');
  expect(extendedVariant.maxNumber).toBe(99);
});

test('EggCountingGameExtendedVariantInfo type validation', () => {
  const variant: EggCountingGameExtendedVariantInfo =
    getEggCountingGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.maxNumber).toBe('number');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
