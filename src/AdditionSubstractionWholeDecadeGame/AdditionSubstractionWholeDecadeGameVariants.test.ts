import {
  getAdditionSubstractionWholeDecadeGameVariant,
  additionSubstractionWholeDecadeGameVariants,
  type AdditionSubstractionWholeDecadeGameExtendedVariantInfo,
} from './AdditionSubstractionWholeDecadeGameVariants';

test('additionSubstractionWholeDecadeGameVariants has expected keys', () => {
  expect(
    Object.keys(additionSubstractionWholeDecadeGameVariants),
  ).toStrictEqual(['aa', 'ab', 'ac', 'ba', 'bb', 'bc']);
});

test('getAdditionSubstractionWholeDecadeGameVariant for aa', () => {
  const extendedVariant = getAdditionSubstractionWholeDecadeGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.mainCode).toBe('B');
  expect(extendedVariant.description).toBe('Sommen als 34+40');
  expect(extendedVariant.exampleSums).toEqual(['34+40']);
});

test('getAdditionSubstractionWholeDecadeGameVariant for ac', () => {
  const extendedVariant = getAdditionSubstractionWholeDecadeGameVariant('ac');
  expect(extendedVariant.iconColor).toBe('yellow');
  expect(extendedVariant.mainCode).toBe('B');
  expect(extendedVariant.description).toBe('Sommen als 34+40 en 58−30');
  expect(extendedVariant.exampleSums).toEqual(['34+40', '58−30']);
});

test('getAdditionSubstractionWholeDecadeGameVariant for ba', () => {
  const extendedVariant = getAdditionSubstractionWholeDecadeGameVariant('ba');
  expect(extendedVariant.iconColor).toBe('lime');
  expect(extendedVariant.mainCode).toBe('B');
  expect(extendedVariant.description).toBe('Sommen als 50+8');
  expect(extendedVariant.exampleSums).toEqual(['50+8']);
});

test('getAdditionSubstractionWholeDecadeGameVariant for bc', () => {
  const extendedVariant = getAdditionSubstractionWholeDecadeGameVariant('bc');
  expect(extendedVariant.iconColor).toBe('cyan');
  expect(extendedVariant.mainCode).toBe('B');
  expect(extendedVariant.description).toBe('Sommen als 50+8 en 70−5');
  expect(extendedVariant.exampleSums).toEqual(['50+8', '70−5']);
});

test('getAdditionSubstractionWholeDecadeGameVariant for unknown variant returns default', () => {
  const extendedVariant =
    getAdditionSubstractionWholeDecadeGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.mainCode).toBe('B');
});

test('AdditionSubstractionWholeDecadeGameExtendedVariantInfo type validation', () => {
  const variant: AdditionSubstractionWholeDecadeGameExtendedVariantInfo =
    getAdditionSubstractionWholeDecadeGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
  expect(Array.isArray(variant.exampleSums)).toBe(true);
  expect(typeof variant.exampleSums[0]).toBe('string');
});
