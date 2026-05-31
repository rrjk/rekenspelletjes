import {
  getCombineToSolveSumGameVariant,
  combineToSolveSumGameVariants,
  type CombineToSolveSumGameExtendedVariantInfo,
} from './CombineToSolveSumGameVariants';

test('combineToSolveSumGameVariants has expected keys', () => {
  expect(Object.keys(combineToSolveSumGameVariants)).toStrictEqual(['aa']);
});

test('getCombineToSolveSumGameVariant for aa', () => {
  const variant = getCombineToSolveSumGameVariant('aa');
  expect(variant.mainCode).toBe('N');
  expect(variant.description).toBe(
    'Sleep twee harten over elkaar heen die samen 10 maken.',
  );
  expect(variant.iconNumbers).toStrictEqual([3, 7]);
});

test('getCombineToSolveSumGameVariant for unknown variant returns default', () => {
  const variant = getCombineToSolveSumGameVariant('unknown');
  expect(variant.mainCode).toBe('N');
});

test('CombineToSolveSumGameExtendedVariantInfo type validation', () => {
  const variant: CombineToSolveSumGameExtendedVariantInfo =
    getCombineToSolveSumGameVariant('aa');
  expect(typeof variant.description).toBe('string');
});
