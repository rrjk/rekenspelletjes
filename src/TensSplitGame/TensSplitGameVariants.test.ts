import {
  getTensSplitGameVariant,
  tensSplitGameVariants,
  type TensSplitGameExtendedVariantInfo,
} from './TensSplitGameVariants';

test('tensSplitGameVariants has expected keys', () => {
  expect(Object.keys(tensSplitGameVariants)).toStrictEqual(['aa']);
});

test('getTensSplitGameVariant for aa', () => {
  const extendedVariant = getTensSplitGameVariant('aa');

  expect(extendedVariant.mainCode).toBe('W');
  expect(extendedVariant.description).toBe(
    'Splits het getal in tientallen en eenheden',
  );
  expect(extendedVariant.minTens).toBe(1);
  expect(extendedVariant.maxTens).toBe(9);
  expect(extendedVariant.minUnits).toBe(1);
  expect(extendedVariant.maxUnits).toBe(9);
  expect(extendedVariant.iconNumberToSplit).toBe(56);
  expect(extendedVariant.iconActiveDigit).toBe(2);
});

test('getTensSplitGameVariant for unknown variant returns default', () => {
  const extendedVariant = getTensSplitGameVariant('unknown');

  expect(extendedVariant.minTens).toBe(1);
  expect(extendedVariant.maxTens).toBe(9);
  expect(extendedVariant.iconNumberToSplit).toBe(56);
});

test('TensSplitGameExtendedVariantInfo type validation', () => {
  const variant: TensSplitGameExtendedVariantInfo =
    getTensSplitGameVariant('aa');

  expect(typeof variant.description).toBe('string');
});
