import {
  getSumsWithSplitGameVariant,
  sumsWithSplitGameVariants,
  type SumsWithSplitGameExtendedVariantInfo,
} from './SumsWithSplitGameVariants';

test('sumsWithSplitGameVariants has expected keys', () => {
  expect(Object.keys(sumsWithSplitGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'ba',
    'bb',
    'bc',
    'bd',
    'be',
    'bf',
    'ca',
    'cb',
    'cc',
    'cd',
    'ce',
    'cf',
  ]);
});

test('getSumsWithSplitGameVariant for aa', () => {
  const extendedVariant = getSumsWithSplitGameVariant('aa');
  expect(extendedVariant.game).toBe('split1Till20');
  expect(extendedVariant.operators).toStrictEqual(['plus']);
  expect(extendedVariant.showSplits).toBe('showSplits');
  expect(extendedVariant.mainCode).toBe('G');
  expect(extendedVariant.description).toBe('Sommen zoals 6+8, met splitsen');
  expect(extendedVariant.exampleSums).toStrictEqual({
    text1: '6+8',
    text2: '',
  });
});

test('getSumsWithSplitGameVariant for cc', () => {
  const extendedVariant = getSumsWithSplitGameVariant('cc');
  expect(extendedVariant.game).toBe('split2Till100');
  expect(extendedVariant.operators).toStrictEqual(['plus', 'minus']);
  expect(extendedVariant.showSplits).toBe('showSplits');
  expect(extendedVariant.mainCode).toBe('V');
  expect(extendedVariant.description).toBe(
    'Sommen zoals 47+38 en 65−49, met splitsen',
  );
  expect(extendedVariant.exampleSums).toStrictEqual({
    text1: '47+38',
    text2: '65−49',
  });
});

test('getSumsWithSplitGameVariant for unknown variant returns default', () => {
  const extendedVariant = getSumsWithSplitGameVariant('unknown');
  expect(extendedVariant.game).toBe('split1Till20');
  expect(extendedVariant.operators).toStrictEqual(['plus']);
  expect(extendedVariant.showSplits).toBe('showSplits');
  expect(extendedVariant.mainCode).toBe('G');
});

test('SumsWithSplitGameExtendedVariantInfo type validation', () => {
  const variant: SumsWithSplitGameExtendedVariantInfo =
    getSumsWithSplitGameVariant('aa');
  expect(typeof variant.iconColor).toBe('string');
  expect(typeof variant.game).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
