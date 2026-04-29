import {
  getNumberlineArchesGameVariant,
  numberlineArchesGameVariants,
  type NumberlineArchesGameExtendedVariantInfo,
} from './NumberlineArchesGameVariants';

test('numberlineArchesGameVariants has expected keys', () => {
  expect(Object.keys(numberlineArchesGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    'ba',
    'bb',
    'bc',
  ]);
});

test('getNumberlineArchesGameVariant for aa', () => {
  const extendedVariant = getNumberlineArchesGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('olive');
  expect(extendedVariant.mainCode).toBe('X');
  expect(extendedVariant.operator).toBe('plus');
  expect(extendedVariant.min).toBe(0);
  expect(extendedVariant.max).toBe(10);
  expect(extendedVariant.description).toBe(
    'Getallenlijn boogjes spel: plus sommen 0 tot 10, zonder splitsen',
  );
});

test('getNumberlineArchesGameVariant for ac (split)', () => {
  const extendedVariant = getNumberlineArchesGameVariant('ac');
  expect(extendedVariant.iconColor).toBe('apricot');
  expect(extendedVariant.split).toBe('split');
  expect(extendedVariant.description).toBe(
    'Getallenlijn boogjes spel: plus sommen 0 tot 20, met splitsen',
  );
});

test('getNumberlineArchesGameVariant for ba (minus)', () => {
  const extendedVariant = getNumberlineArchesGameVariant('ba');
  expect(extendedVariant.iconColor).toBe('pink');
  expect(extendedVariant.operator).toBe('minus');
  expect(extendedVariant.description).toBe(
    'Getallenlijn boogjes spel: min sommen 0 tot 10, zonder splitsen',
  );
});

test('getNumberlineArchesGameVariant for unknown variant returns default', () => {
  const extendedVariant = getNumberlineArchesGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('olive');
  expect(extendedVariant.operator).toBe('plus');
});

test('NumberlineArchesGameExtendedVariantInfo type validation', () => {
  const variant: NumberlineArchesGameExtendedVariantInfo =
    getNumberlineArchesGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
  expect(typeof variant.min).toBe('number');
  expect(typeof variant.max).toBe('number');
});
