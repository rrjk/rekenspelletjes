import {
  divisionWithSplitGameVariants,
  getDivisionWithSplitGameVariant,
  type DivisionWithSplitGameExtendedVariantInfo,
} from './DivisionWithSplitGameVariants';

test('divisionWithSplitGameVariants has expected keys', () => {
  expect(Object.keys(divisionWithSplitGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
  ]);
});

test('getDivisionWithSplitGameVariant for aa', () => {
  const extendedVariant = getDivisionWithSplitGameVariant('aa');

  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.mainCode).toBe('Z');
  expect(extendedVariant.decades).toStrictEqual([10]);
  expect(extendedVariant.description).toBe(
    'Delen met splitsen, antwoorden van 11 t/m 19',
  );
});

test('getDivisionWithSplitGameVariant for ac', () => {
  const extendedVariant = getDivisionWithSplitGameVariant('ac');

  expect(extendedVariant.showHelp).toBe(false);
  expect(extendedVariant.showSubAnswers).toBe(false);
  expect(extendedVariant.decades).toStrictEqual([
    10, 20, 30, 40, 50, 60, 70, 80, 90,
  ]);
});

test('getDivisionWithSplitGameVariant for unknown variant returns default', () => {
  const extendedVariant = getDivisionWithSplitGameVariant('unknown');

  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.decades).toStrictEqual([10]);
});

test('DivisionWithSplitGameExtendedVariantInfo type validation', () => {
  const variant: DivisionWithSplitGameExtendedVariantInfo =
    getDivisionWithSplitGameVariant('aa');

  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
