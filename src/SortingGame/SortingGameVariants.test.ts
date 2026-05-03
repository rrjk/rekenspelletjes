import {
  getSortingGameVariant,
  sortingGameVariants,
  type SortingGameExtendedVariantInfo,
} from './SortingGameVariants';

test('sortingGameVariants has expected keys', () => {
  expect(Object.keys(sortingGameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac', // Section A: Numbers 1-10
    'ba',
    'bb',
    'bc', // Section B: Numbers 1-30
    'ca',
    'cb',
    'cc', // Section C: Numbers 1-50
    'da',
    'db',
    'dc', // Section D: Numbers 1-100
    'ea',
    'eb', // Section E: Large numbers
    'fa',
    'fb',
    'fc', // Section F: Decimal numbers
  ]);
});

test('getSortingGameVariant for aa (2 boxes, 1-10, red)', () => {
  const extendedVariant = getSortingGameVariant('aa');
  expect(extendedVariant.numberBoxes).toBe(2);
  expect(extendedVariant.minimumValue).toBe(1);
  expect(extendedVariant.maximumValue).toBe(10);
  expect(extendedVariant.divider).toBe(1);
  expect(extendedVariant.boxColor).toBe('red');
  expect(extendedVariant.mainCode).toBe('E');
  expect(extendedVariant.description).toBe(
    'Zet 2 dozen met getallen van 1 tot en met 10 in de juiste volgorde',
  );
});

test('getSortingGameVariant for dc (4 boxes, 1-100, red)', () => {
  const extendedVariant = getSortingGameVariant('dc');
  expect(extendedVariant.numberBoxes).toBe(4);
  expect(extendedVariant.minimumValue).toBe(1);
  expect(extendedVariant.maximumValue).toBe(100);
  expect(extendedVariant.divider).toBe(1);
  expect(extendedVariant.boxColor).toBe('red');
  expect(extendedVariant.mainCode).toBe('E');
  expect(extendedVariant.description).toBe(
    'Zet 4 dozen met getallen van 1 tot en met 100 in de juiste volgorde',
  );
});

test('getSortingGameVariant for eb (4 boxes, 1-10000, blue)', () => {
  const extendedVariant = getSortingGameVariant('eb');
  expect(extendedVariant.numberBoxes).toBe(4);
  expect(extendedVariant.minimumValue).toBe(1);
  expect(extendedVariant.maximumValue).toBe(10000);
  expect(extendedVariant.divider).toBe(1);
  expect(extendedVariant.boxColor).toBe('blue');
  expect(extendedVariant.mainCode).toBe('S');
  expect(extendedVariant.description).toBe(
    'Zet 4 dozen met getallen van 1 tot en met 10000 in de juiste volgorde',
  );
});

test('getSortingGameVariant for fa (decimal numbers, purple)', () => {
  const extendedVariant = getSortingGameVariant('fa');
  expect(extendedVariant.numberBoxes).toBe(4);
  expect(extendedVariant.minimumValue).toBe(1);
  expect(extendedVariant.maximumValue).toBe(10);
  expect(extendedVariant.divider).toBe(10);
  expect(extendedVariant.boxColor).toBe('purple');
  expect(extendedVariant.mainCode).toBe('S');
  expect(extendedVariant.description).toBe(
    'Kommagetallen met 1 cijfer achter de komma (4 dozen)',
  );
});

test('getSortingGameVariant for fb (2 decimal places, purple)', () => {
  const extendedVariant = getSortingGameVariant('fb');
  expect(extendedVariant.divider).toBe(100);
  expect(extendedVariant.mainCode).toBe('S');
  expect(extendedVariant.description).toBe(
    'Kommagetallen met 2 cijfers achter de komma (4 dozen)',
  );
});

test('getSortingGameVariant for fc (3 decimal places, purple)', () => {
  const extendedVariant = getSortingGameVariant('fc');
  expect(extendedVariant.divider).toBe(1000);
  expect(extendedVariant.mainCode).toBe('S');
  expect(extendedVariant.description).toBe(
    'Kommagetallen met 3 cijfers achter de komma (4 dozen)',
  );
});

test('getSortingGameVariant for unknown variant returns default', () => {
  const extendedVariant = getSortingGameVariant('unknown');
  expect(extendedVariant.numberBoxes).toBe(4);
  expect(extendedVariant.minimumValue).toBe(1);
  expect(extendedVariant.maximumValue).toBe(10);
  expect(extendedVariant.divider).toBe(1);
  expect(extendedVariant.boxColor).toBe('red');
  expect(extendedVariant.mainCode).toBe('E');
});

test('SortingGameExtendedVariantInfo type validation', () => {
  const variant: SortingGameExtendedVariantInfo = getSortingGameVariant('aa');
  expect(typeof variant.numberBoxes).toBe('number');
  expect(typeof variant.minimumValue).toBe('number');
  expect(typeof variant.maximumValue).toBe('number');
  expect(typeof variant.divider).toBe('number');
  expect(typeof variant.boxColor).toBe('string');
  expect(typeof variant.mainCode).toBe('string');
  expect(typeof variant.description).toBe('string');
});
