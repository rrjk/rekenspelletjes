import {
  getClickInOrderGameVariant,
  clickInOrderGameVariants,
  type ClickInOrderGameExtendedVariantInfo,
} from './ClickInOrderGameVariants';

test('clickInOrderGameVariants has expected keys', () => {
  expect(Object.keys(clickInOrderGameVariants)).toStrictEqual([
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
    'ca',
    'cb',
    'cc',
    'cd',
    'ce',
    'cf',
    'cg',
    'ch',
    'ci',
    'da',
    'db',
    'dc',
    'dd',
    'de',
    'df',
    'dg',
    'dh',
    'di',
    'dj',
    'dk',
  ]);
});

test('getClickInOrderGameVariant for aa', () => {
  const extendedVariant = getClickInOrderGameVariant('aa');
  expect(extendedVariant.gameType).toBe('numberSequence');
  if (extendedVariant.gameType === 'numberSequence') {
    expect(extendedVariant.numberSequenceConfig.start).toBe(1);
    expect(extendedVariant.numberSequenceConfig.nmbrBalls).toBe(10);
    expect(extendedVariant.numberSequenceConfig.direction).toBe('ascending');
    expect(extendedVariant.numberSequenceConfig.numberType).toBe('all');
  }
  expect(extendedVariant.mainCode).toBe('H');
  expect(extendedVariant.description).toBe(
    'Oplopende getallenrij van 1 t/m 10.',
  );
  expect(extendedVariant.iconText).toBe('1 2 ... 10');
  expect(extendedVariant.iconShowDie).toBe(false);
  expect(extendedVariant.iconSmallFont).toBe(false);
});

test('getClickInOrderGameVariant for ba', () => {
  const extendedVariant = getClickInOrderGameVariant('ba');
  expect(extendedVariant.gameType).toBe('numberSequence');
  if (extendedVariant.gameType === 'numberSequence') {
    expect(extendedVariant.numberSequenceConfig.start).toBe('random');
    expect(extendedVariant.numberSequenceConfig.nmbrBalls).toBe(20);
    expect(extendedVariant.numberSequenceConfig.direction).toBe('ascending');
    expect(extendedVariant.numberSequenceConfig.numberType).toBe('all');
  }
  expect(extendedVariant.mainCode).toBe('H');
  expect(extendedVariant.description).toBe(
    'Oplopende getallenrij van 20 getallen, startend bij een willekeurig getal.',
  );
  expect(extendedVariant.iconText).toBe('');
  expect(extendedVariant.iconShowDie).toBe(true);
  expect(extendedVariant.iconSmallFont).toBe(false);
});

test('getClickInOrderGameVariant for ah (descending)', () => {
  const extendedVariant = getClickInOrderGameVariant('ah');
  expect(extendedVariant.gameType).toBe('numberSequence');
  if (extendedVariant.gameType === 'numberSequence') {
    expect(extendedVariant.numberSequenceConfig.start).toBe(20);
    expect(extendedVariant.numberSequenceConfig.nmbrBalls).toBe(20);
    expect(extendedVariant.numberSequenceConfig.direction).toBe('descending');
    expect(extendedVariant.numberSequenceConfig.numberType).toBe('all');
  }
  expect(extendedVariant.mainCode).toBe('H');
  expect(extendedVariant.description).toBe(
    'Aflopende getallenrij van 20 t/m 1.',
  );
  expect(extendedVariant.iconText).toBe('20 19 ... 1');
  expect(extendedVariant.iconShowDie).toBe(false);
});

test('getClickInOrderGameVariant for bb (even numbers)', () => {
  const extendedVariant = getClickInOrderGameVariant('bb');
  expect(extendedVariant.gameType).toBe('numberSequence');
  if (extendedVariant.gameType === 'numberSequence') {
    expect(extendedVariant.numberSequenceConfig.start).toBe(2);
    expect(extendedVariant.numberSequenceConfig.nmbrBalls).toBe(10);
    expect(extendedVariant.numberSequenceConfig.direction).toBe('ascending');
    expect(extendedVariant.numberSequenceConfig.numberType).toBe('even');
  }
  expect(extendedVariant.mainCode).toBe('H');
  expect(extendedVariant.description).toBe(
    'Oplopende getallenrij van alle even getallen van 2 t/m 20.',
  );
  expect(extendedVariant.iconText).toBe('Even');
  expect(extendedVariant.iconShowDie).toBe(false);
});

test('getClickInOrderGameVariant for bc (odd numbers)', () => {
  const extendedVariant = getClickInOrderGameVariant('bc');
  expect(extendedVariant.gameType).toBe('numberSequence');
  if (extendedVariant.gameType === 'numberSequence') {
    expect(extendedVariant.numberSequenceConfig.start).toBe(1);
    expect(extendedVariant.numberSequenceConfig.nmbrBalls).toBe(10);
    expect(extendedVariant.numberSequenceConfig.direction).toBe('ascending');
    expect(extendedVariant.numberSequenceConfig.numberType).toBe('odd');
  }
  expect(extendedVariant.mainCode).toBe('H');
  expect(extendedVariant.description).toBe(
    'Oplopende getallenrij van alle oneven getallen van 1 t/m 19.',
  );
  expect(extendedVariant.iconText).toBe('Oneven');
  expect(extendedVariant.iconShowDie).toBe(false);
});

test('getClickInOrderGameVariant for ca', () => {
  const extendedVariant = getClickInOrderGameVariant('ca');
  expect(extendedVariant.gameType).toBe('multiplicationTable');
  if (extendedVariant.gameType === 'multiplicationTable') {
    expect(extendedVariant.multiplicationConfig.tableOfMultiplication).toEqual([
      10,
    ]);
    expect(extendedVariant.multiplicationConfig.nmbrBalls).toBe(10);
    expect(extendedVariant.multiplicationConfig.showSum).toBe(false);
    expect(extendedVariant.multiplicationConfig.iconColorPermutation).toBe(1);
  }
  expect(extendedVariant.mainCode).toBe('P');
  expect(extendedVariant.description).toBe(
    'Klik de getallen aan, van klein naar groot, met sprongen van 10.',
  );
  expect(extendedVariant.iconText).toBe('10');
});

test('getClickInOrderGameVariant for da', () => {
  const extendedVariant = getClickInOrderGameVariant('da');
  expect(extendedVariant.gameType).toBe('multiplicationWithSum');
  if (extendedVariant.gameType === 'multiplicationWithSum') {
    expect(extendedVariant.multiplicationConfig.tableOfMultiplication).toEqual([
      2,
    ]);
    expect(extendedVariant.multiplicationConfig.nmbrBalls).toBe(10);
    expect(extendedVariant.multiplicationConfig.showSum).toBe(true);
    expect(extendedVariant.multiplicationConfig.iconColorPermutation).toBe(1);
  }
  expect(extendedVariant.mainCode).toBe('Q');
  expect(extendedVariant.description).toBe(
    'Kies het juiste getal bij de keersommen van de tafel van 2.',
  );
  expect(extendedVariant.iconText).toBe('×2');
});

test('getClickInOrderGameVariant for df (multiple tables)', () => {
  const extendedVariant = getClickInOrderGameVariant('df');
  expect(extendedVariant.gameType).toBe('multiplicationWithSum');
  if (extendedVariant.gameType === 'multiplicationWithSum') {
    expect(extendedVariant.multiplicationConfig.tableOfMultiplication).toEqual([
      2, 3, 4, 5, 10,
    ]);
    expect(extendedVariant.multiplicationConfig.nmbrBalls).toBe(10);
    expect(extendedVariant.multiplicationConfig.showSum).toBe(true);
    expect(extendedVariant.multiplicationConfig.iconColorPermutation).toBe(11);
  }
  expect(extendedVariant.mainCode).toBe('Q');
  expect(extendedVariant.description).toBe(
    'Kies het juiste getal bij de keersommen van de tafels van 2, 3, 4, 5 en 10.',
  );
  expect(extendedVariant.iconText).toBe('×2,3,4,5,10');
  expect(extendedVariant.iconSmallFont).toBe(true);
});

test('getClickInOrderGameVariant for dk (all tables)', () => {
  const extendedVariant = getClickInOrderGameVariant('dk');
  expect(extendedVariant.gameType).toBe('multiplicationWithSum');
  expect(extendedVariant.mainCode).toBe('Q');
  expect(extendedVariant.iconText).toBe('alle tafels');
  expect(extendedVariant.iconSmallFont).toBe(true);
});

test('getClickInOrderGameVariant for unknown variant returns default', () => {
  const extendedVariant = getClickInOrderGameVariant('unknown');
  expect(extendedVariant.gameType).toBe('numberSequence');
  if (extendedVariant.gameType === 'numberSequence') {
    expect(extendedVariant.numberSequenceConfig.start).toBe(1);
  }
  expect(extendedVariant.mainCode).toBe('H');
  expect(extendedVariant.description).toBe(
    'Oplopende getallenrij van 1 t/m 10.',
  );
});

test('ClickInOrderGameExtendedVariantInfo type validation', () => {
  const variant: ClickInOrderGameExtendedVariantInfo =
    getClickInOrderGameVariant('aa');
  expect(typeof variant.gameType).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
  expect(typeof variant.iconText).toBe('string');
  expect(typeof variant.iconShowDie).toBe('boolean');
  expect(typeof variant.iconSmallFont).toBe('boolean');
});
