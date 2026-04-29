import {
  getHowManyFingersGameVariant,
  howManyFingersGameVariants,
  type HowManyFingersGameExtendedVariantInfo,
} from './HowManyFingersGameVariants';

test('howManyFingersGameVariants has expected keys', () => {
  expect(Object.keys(howManyFingersGameVariants)).toStrictEqual(['aa', 'ab']);
});

test('getHowManyFingersGameVariant for aa', () => {
  const extendedVariant = getHowManyFingersGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('purple');
  expect(extendedVariant.minFingers).toBe(1);
  expect(extendedVariant.maxFingers).toBe(5);
  expect(extendedVariant.mainCode).toBe('AB');
  expect(extendedVariant.description).toBe(
    'Tel het aantal vingers op één hand (1 tot en met 5).',
  );
});

test('getHowManyFingersGameVariant for ab', () => {
  const extendedVariant = getHowManyFingersGameVariant('ab');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.minFingers).toBe(1);
  expect(extendedVariant.maxFingers).toBe(10);
  expect(extendedVariant.mainCode).toBe('AB');
  expect(extendedVariant.description).toBe(
    'Tel het aantal vingers op één of twee handen.',
  );
});

test('getHowManyFingersGameVariant for unknown variant returns default', () => {
  const extendedVariant = getHowManyFingersGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('purple');
  expect(extendedVariant.minFingers).toBe(1);
  expect(extendedVariant.maxFingers).toBe(5);
  expect(extendedVariant.mainCode).toBe('AB');
});

test('HowManyFingersGameExtendedVariantInfo type validation for aa', () => {
  const variant: HowManyFingersGameExtendedVariantInfo =
    getHowManyFingersGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.minFingers).toBe('number');
  expect(typeof variant.maxFingers).toBe('number');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
