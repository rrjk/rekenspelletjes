import {
  getSplitBalloonGameVariant,
  gameVariants,
  type ExtendedVariantInfo,
} from './SplitBalloonGameVariants';

test('gameVariants has expected keys', () => {
  expect(Object.keys(gameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'ag',
    'ah',
    'ba',
    'bb',
    'bc',
  ]);
});

test('getSplitBalloonGameVariant for single digit variant (aa)', () => {
  const extendedVariant = getSplitBalloonGameVariant('aa');
  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.numbersToSplit).toStrictEqual([3]);
  expect(extendedVariant.mainCode).toBe('R');
  expect(extendedVariant.description).toBe('Splitsingen van 3');
});

test('getSplitBalloonGameVariant for multi digit variant (ba)', () => {
  const extendedVariant = getSplitBalloonGameVariant('ba');
  expect(extendedVariant.iconColor).toBe('navy');
  expect(extendedVariant.numbersToSplit).toStrictEqual([3, 4, 5, 10]);
  expect(extendedVariant.mainCode).toBe('R');
  expect(extendedVariant.description).toBe('Splitsingen van 3 t/m 5 en 10');
});

test('getSplitBalloonGameVariant for full range variant (bc)', () => {
  const extendedVariant = getSplitBalloonGameVariant('bc');
  expect(extendedVariant.iconColor).toBe('purple');
  expect(extendedVariant.numbersToSplit).toStrictEqual([
    3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  expect(extendedVariant.mainCode).toBe('R');
  expect(extendedVariant.description).toBe('Splitsingen van 3 t/m 10');
});

test('getSplitBalloonGameVariant for unknown variant returns default', () => {
  const extendedVariant = getSplitBalloonGameVariant('unknown');
  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.numbersToSplit).toStrictEqual([3]);
  expect(extendedVariant.mainCode).toBe('R');
  expect(extendedVariant.description).toBe('Splitsingen van 3');
});

test('ExtendedVariantInfo type validation', () => {
  const variant: ExtendedVariantInfo = getSplitBalloonGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(Array.isArray(variant.numbersToSplit)).toBe(true);
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
