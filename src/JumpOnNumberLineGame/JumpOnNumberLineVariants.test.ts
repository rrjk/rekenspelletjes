import {
  getJumpOnNumberLineVariant,
  jumpOnNumberLineVariants,
  type JumpOnNumberLineExtendedVariantInfo,
} from './JumpOnNumberLineVariants';

test('jumpOnNumberLineVariants has expected keys', () => {
  expect(Object.keys(jumpOnNumberLineVariants)).toStrictEqual([
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
  ]);
});

test('getJumpOnNumberLineVariant for aa', () => {
  const extendedVariant = getJumpOnNumberLineVariant('aa');
  expect(extendedVariant.iconColor).toBe('maroon');
  expect(extendedVariant.mainCode).toBe('U');
  expect(extendedVariant.minimum).toBe(0);
  expect(extendedVariant.maximum).toBe(20);
});

test('getJumpOnNumberLineVariant for dd', () => {
  const extendedVariant = getJumpOnNumberLineVariant('dd');
  expect(extendedVariant.iconColor).toBe('cyan');
  expect(extendedVariant.minimum).toBe(0);
  expect(extendedVariant.maximum).toBe(100);
});

test('getJumpOnNumberLineVariant for unknown variant returns default', () => {
  const extendedVariant = getJumpOnNumberLineVariant('unknown');
  expect(extendedVariant.iconColor).toBe('maroon');
  expect(extendedVariant.minimum).toBe(0);
  expect(extendedVariant.maximum).toBe(20);
});

test('JumpOnNumberLineExtendedVariantInfo type validation', () => {
  const variant: JumpOnNumberLineExtendedVariantInfo =
    getJumpOnNumberLineVariant('aa');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
  expect(typeof variant.minimum).toBe('number');
});
