import {
  additionSubstractionWithinDecadeGameVariants,
  getAdditionSubstractionWithinDecadeGameVariant,
  type AdditionSubstractionWithinDecadeGameExtendedVariantInfo,
} from './AdditionSubstractionWithinDecadeGameVariants';

test('additionSubstractionWithinDecadeGameVariants has expected keys', () => {
  expect(
    Object.keys(additionSubstractionWithinDecadeGameVariants),
  ).toStrictEqual(['aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc']);
});

test('getAdditionSubstractionWithinDecadeGameVariant for aa', () => {
  const extendedVariant = getAdditionSubstractionWithinDecadeGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.decades).toStrictEqual([0]);
  expect(extendedVariant.operators).toStrictEqual(['plus']);
  expect(extendedVariant.mainCode).toBe('A');
  expect(extendedVariant.description).toBe('Sommen als 3+4');
});

test('getAdditionSubstractionWithinDecadeGameVariant for ba', () => {
  const extendedVariant = getAdditionSubstractionWithinDecadeGameVariant('ba');
  expect(extendedVariant.iconColor).toBe('lime');
  expect(extendedVariant.decades).toStrictEqual([10]);
  expect(extendedVariant.operators).toStrictEqual(['plus']);
  expect(extendedVariant.mainCode).toBe('A');
  expect(extendedVariant.description).toBe('Sommen als 13+4');
});

test('getAdditionSubstractionWithinDecadeGameVariant for ca', () => {
  const extendedVariant = getAdditionSubstractionWithinDecadeGameVariant('ca');
  expect(extendedVariant.iconColor).toBe('blue');
  expect(extendedVariant.decades).toStrictEqual([
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90,
  ]);
  expect(extendedVariant.operators).toStrictEqual(['plus']);
  expect(extendedVariant.mainCode).toBe('A');
  expect(extendedVariant.description).toBe('Sommen als 45+2');
});

test('getAdditionSubstractionWithinDecadeGameVariant for ac (plus and minus)', () => {
  const extendedVariant = getAdditionSubstractionWithinDecadeGameVariant('ac');
  expect(extendedVariant.iconColor).toBe('yellow');
  expect(extendedVariant.decades).toStrictEqual([0]);
  expect(extendedVariant.operators).toStrictEqual(['plus', 'minus']);
  expect(extendedVariant.mainCode).toBe('A');
  expect(extendedVariant.description).toBe('Sommen als 3+4 en 7-5');
});

test('getAdditionSubstractionWithinDecadeGameVariant for unknown variant returns default', () => {
  const extendedVariant =
    getAdditionSubstractionWithinDecadeGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.decades).toStrictEqual([0]);
  expect(extendedVariant.operators).toStrictEqual(['plus']);
  expect(extendedVariant.mainCode).toBe('A');
});

test('AdditionSubstractionWithinDecadeGameExtendedVariantInfo type validation', () => {
  const variant: AdditionSubstractionWithinDecadeGameExtendedVariantInfo =
    getAdditionSubstractionWithinDecadeGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
  expect(typeof variant.exampleSums).toBe('object');
  expect(typeof variant.exampleSums.text1).toBe('string');
  expect(typeof variant.exampleSums.text2).toBe('string');
  expect(Array.isArray(variant.decades)).toBe(true);
  expect(Array.isArray(variant.operators)).toBe(true);
});
