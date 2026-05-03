import {
  getDieFaceGameVariant,
  dieFaceGameVariants,
  type DieFaceGameExtendedVariantInfo,
} from './DieFaceGameVariants';

test('dieFaceGameVariants has expected keys', () => {
  expect(Object.keys(dieFaceGameVariants)).toStrictEqual(['aa']);
});

test('getDieFaceGameVariant for aa', () => {
  const extendedVariant = getDieFaceGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('purple');
  expect(extendedVariant.numberDots).toBe(3);
  expect(extendedVariant.mainCode).toBe('AA');
  expect(extendedVariant.description).toBe(
    'Tel het aantal stippen op één dobbelsteen',
  );
});

test('getDieFaceGameVariant for unknown variant returns default', () => {
  const extendedVariant = getDieFaceGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('purple');
  expect(extendedVariant.numberDots).toBe(3);
  expect(extendedVariant.mainCode).toBe('AA');
  expect(extendedVariant.description).toBe(
    'Tel het aantal stippen op één dobbelsteen',
  );
});

test('DieFaceGameExtendedVariantInfo type validation', () => {
  const variant: DieFaceGameExtendedVariantInfo = getDieFaceGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.numberDots).toBe('number');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
