import {
  mixedSumIcon,
  mixedSumsGameVariants,
  getMixedSumsGameVariant,
  type MixedSumIcon,
} from './MixedSumsGameVariants';

test('mixedSumIcon contains expected values', () => {
  expect(mixedSumIcon).toStrictEqual([
    'rectangle',
    'puzzlePiece',
    'multiplicationIcon',
  ]);
});

test('mixedSumsGameVariants has expected keys', () => {
  expect(Object.keys(mixedSumsGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'ag',
    'ah',
    'ai',
    'aj',
    'ak',
    'al',
    'ba',
    'bb',
    'bc',
    'bd',
    'be',
    'bf',
    'bg',
    'bh',
    'bi',
    'bj',
    'bk',
    'bl',
    'ca',
    'cb',
  ]);
});

test('getMixedSumsGameVariant for aa', () => {
  const extendedVariant = getMixedSumsGameVariant('aa');
  expect(extendedVariant.icon).toBe('puzzlePiece');
  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.maxAnswer).toBe(10);
  expect(extendedVariant.eligibleTables).toStrictEqual([
    2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  expect(extendedVariant.operators).toStrictEqual(['plus', 'minus']);
  expect(extendedVariant.mainCode).toBe('AC');
  expect(extendedVariant.description).toBe(
    'Plus en min sommen met antwoorden tot en met 10.',
  );
});

test('getMixedSumsGameVariant for ab', () => {
  const extendedVariant = getMixedSumsGameVariant('ab');
  expect(extendedVariant.icon).toBe('puzzlePiece');
  expect(extendedVariant.iconColor).toBe('red');
  expect(extendedVariant.maxAnswer).toBe(100);
  expect(extendedVariant.operators).toStrictEqual(['plus', 'minus']);
  expect(extendedVariant.mainCode).toBe('AC');
  expect(extendedVariant.description).toBe(
    'Plus en min sommen met antwoorden tot en met 100.',
  );
});

test('getMixedSumsGameVariant for ac', () => {
  const extendedVariant = getMixedSumsGameVariant('ac');
  expect(extendedVariant.icon).toBe('puzzlePiece');
  expect(extendedVariant.iconColor).toBe('orange');
  expect(extendedVariant.maxAnswer).toBe(1000);
  expect(extendedVariant.operators).toStrictEqual(['plus', 'minus']);
  expect(extendedVariant.mainCode).toBe('AC');
  expect(extendedVariant.description).toBe(
    'Plus en min sommen met antwoorden tot en met 1000.',
  );
});

test('getMixedSumsGameVariant for ad', () => {
  const extendedVariant = getMixedSumsGameVariant('ad');
  expect(extendedVariant.icon).toBe('puzzlePiece');
  expect(extendedVariant.iconColor).toBe('yellow');
  expect(extendedVariant.maxAnswer).toBe(10);
  expect(extendedVariant.eligibleTables).toStrictEqual([
    2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  expect(extendedVariant.operators).toStrictEqual(['times', 'divide']);
  expect(extendedVariant.mainCode).toBe('AC');
  expect(extendedVariant.description).toBe(
    'Keer en gedeeld door sommen met de tafels tot en met 10.',
  );
});

test('getMixedSumsGameVariant for ba', () => {
  const extendedVariant = getMixedSumsGameVariant('ba');
  expect(extendedVariant.icon).toBe('rectangle');
  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.maxAnswer).toBe(10);
  expect(extendedVariant.operators).toStrictEqual(['plus', 'minus']);
  expect(extendedVariant.mainCode).toBe('AD');
  expect(extendedVariant.description).toBe(
    'Plus en min sommen met antwoorden tot en met 10.',
  );
});

test('getMixedSumsGameVariant for af', () => {
  const extendedVariant = getMixedSumsGameVariant('af');
  expect(extendedVariant.icon).toBe('puzzlePiece');
  expect(extendedVariant.iconColor).toBe('green');
  expect(extendedVariant.maxAnswer).toBe(100);
  expect(extendedVariant.eligibleTables).toStrictEqual([
    2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  expect(extendedVariant.operators).toStrictEqual([
    'plus',
    'minus',
    'times',
    'divide',
  ]);
  expect(extendedVariant.mainCode).toBe('AC');
  expect(extendedVariant.description).toBe(
    'Gemengde plus, min, keer en gedeeld door sommen met antwoorden tot en met 100 en de tafels tot en met 10.',
  );
});

test('getMixedSumsGameVariant supports explicit table lists', () => {
  mixedSumsGameVariants.zz = {
    includePuzzle: false,
    iconColor: 'lavender',
    maxAnswer: 10,
    tables: [2, 5, 7],
    operators: ['times', 'divide'],
  };

  const extendedVariant = getMixedSumsGameVariant('zz');

  expect(extendedVariant.eligibleTables).toStrictEqual([2, 5, 7]);
  expect(extendedVariant.description).toBe(
    'Keer en gedeeld door sommen met de tafels van 2, 5 en 7.',
  );

  Reflect.deleteProperty(mixedSumsGameVariants, 'zz');
});

test('getMixedSumsGameVariant for unknown variant throws error', () => {
  expect(() => getMixedSumsGameVariant('unknown')).toThrow(
    'Unknown game variant: unknown',
  );
});

// Test for MixedSumIcon type - since it's a type, we can test that values conform
test('MixedSumIcon type validation', () => {
  const validIcons: MixedSumIcon[] = [
    'rectangle',
    'puzzlePiece',
    'multiplicationIcon',
  ];
  expect(validIcons).toStrictEqual(mixedSumIcon);
});
