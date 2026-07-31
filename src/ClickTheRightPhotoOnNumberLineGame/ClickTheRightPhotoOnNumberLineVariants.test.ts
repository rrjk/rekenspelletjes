import { expect, test } from '@jest/globals';

import {
  clickTheRightPhotoOnNumberLineVariants,
  getClickTheRightPhotoOnNumberLineVariant,
} from './ClickTheRightPhotoOnNumberLineVariants';

test('clickTheRightPhotoOnNumberLineVariants has expected keys', () => {
  expect(Object.keys(clickTheRightPhotoOnNumberLineVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    'ad',
    'ba',
    'bb',
    'bc',
    'bd',
    'ca',
    'cb',
    'cc',
    'cd',
    'da',
    'db',
    'dc',
    'dd',
    'ea',
    'eb',
    'ec',
  ]);
});

test('getClickTheRightPhotoOnNumberLineVariant for aa', () => {
  const extendedVariant = getClickTheRightPhotoOnNumberLineVariant('aa');
  expect(extendedVariant.iconColor).toBe('maroon');
  expect(extendedVariant.mainCode).toBe('T');
  expect(extendedVariant.numberLineParameters.minimum).toBe(0);
  expect(extendedVariant.numberLineParameters.maximum).toBe(20);
  expect(extendedVariant.numberLineParameters.show1TickMarks).toBe(true);
});

test('getClickTheRightPhotoOnNumberLineVariant for bd', () => {
  const extendedVariant = getClickTheRightPhotoOnNumberLineVariant('bd');
  expect(extendedVariant.iconColor).toBe('yellow');
  expect(extendedVariant.numberLineParameters.minimum).toBe(0);
  expect(extendedVariant.numberLineParameters.maximum).toBe(30);
  expect(extendedVariant.numberLineParameters.showAll10Numbers).toBe(false);
});

test('getClickTheRightPhotoOnNumberLineVariant for unknown variant returns default', () => {
  const extendedVariant = getClickTheRightPhotoOnNumberLineVariant('unknown');
  expect(extendedVariant.iconColor).toBe('maroon');
  expect(extendedVariant.numberLineParameters.minimum).toBe(0);
  expect(extendedVariant.numberLineParameters.maximum).toBe(20);
});
