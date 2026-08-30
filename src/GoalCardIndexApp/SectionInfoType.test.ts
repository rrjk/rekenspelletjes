import {
  decodeSectionInfoList,
  encodeSectionInfoList,
  oneOrTwoLetterToVal,
  readEntryFromBits,
  readGameFromBits,
  readSectionTitleFromBits,
  readTimeCodeFromBits,
  readVariantFromBits,
  valToOneOrTwoLetter,
  writeEntryAsBits,
  writeGameAsBits,
  writeSectionTitleAsBits,
  writeTimeCodeAsBits,
  writeVariantAsBits,
} from './SectionInfoType';
import { BitReader, BitWriter } from '../BitIO';
import type {
  Entry,
  Row,
  SectionInfo,
  SectionInfoList,
} from './SectionInfoType';
import { TimeCode } from '../TimeCodes';
import { GameCode } from '../GameCodes';

test('oneOrTwoLetterToVal converts single and double letter codes', () => {
  expect(oneOrTwoLetterToVal('A')).toBe(1);
  expect(oneOrTwoLetterToVal('Z')).toBe(26);
  expect(oneOrTwoLetterToVal('AA')).toBe(27);
  expect(oneOrTwoLetterToVal('AZ')).toBe(52);
  expect(oneOrTwoLetterToVal('BA')).toBe(53);
});

test('oneOrTwoLetterToVal throws for invalid input lengths', () => {
  expect(() => oneOrTwoLetterToVal('')).toThrow('Invalid code');
  expect(() => oneOrTwoLetterToVal('ABC')).toThrow('Invalid code');
});

test('valToOneOrTwoLetter converts values back to letter codes', () => {
  expect(valToOneOrTwoLetter(0)).toBe('');
  expect(valToOneOrTwoLetter(1)).toBe('A');
  expect(valToOneOrTwoLetter(26)).toBe('Z');
  expect(valToOneOrTwoLetter(27)).toBe('AA');
  expect(valToOneOrTwoLetter(52)).toBe('AZ');
  expect(valToOneOrTwoLetter(53)).toBe('BA');
});

test('valToOneOrTwoLetter throws for out-of-range values', () => {
  expect(() => valToOneOrTwoLetter(703)).toThrow(
    'Invalid value for one or two letter code',
  );
});

test('code round-trips through value conversion for single letters', () => {
  const codes = ['A', 'B', 'Z', 'M'];

  for (const code of codes) {
    expect(valToOneOrTwoLetter(oneOrTwoLetterToVal(code))).toBe(code);
  }
});

test('code round-trips through value conversion for two-letter codes', () => {
  const codes = ['AA', 'AZ', 'BA', 'ZZ'];

  for (const code of codes) {
    expect(valToOneOrTwoLetter(oneOrTwoLetterToVal(code))).toBe(code);
  }
});
test('variant round-trips through bit encoding', () => {
  const values = ['a', 'ab', 'z', 'ba'];

  for (const value of values) {
    const writer = new BitWriter();
    writeVariantAsBits(writer, value);
    const reader = new BitReader(writer.toBase64Url());
    expect(readVariantFromBits(reader)).toBe(value);
  }
});

test('time code round-trips through bit encoding', () => {
  const values: (TimeCode | undefined)[] = ['a', 'b', 'c', undefined];

  for (const value of values) {
    const writer = new BitWriter();
    writeTimeCodeAsBits(writer, value);
    const reader = new BitReader(writer.toBase64Url());
    expect(readTimeCodeFromBits(reader)).toBe(value);
  }
});

test('section title round-trips through bit encoding', () => {
  const values = ['Keersommen', 'Minsommen', 'Aß', 'Γamma'];

  for (const value of values) {
    const writer = new BitWriter();
    writeSectionTitleAsBits(writer, value);
    const reader = new BitReader(writer.toBase64Url());
    expect(readSectionTitleFromBits(reader)).toBe(value);
  }
});

test('game round-trips through bit encoding', () => {
  const values: GameCode[] = ['A', 'AG', 'D'];

  for (const value of values) {
    const writer = new BitWriter();
    writeGameAsBits(writer, value);
    const reader = new BitReader(writer.toBase64Url());
    expect(readGameFromBits(reader)).toBe(value);
  }
});

test('entry round-trips through bit encoding', () => {
  const entry: Entry = {
    game: 'AG',
    variant: 'ab',
    timeCode: 'c',
  };

  const writer = new BitWriter();
  writeEntryAsBits(writer, entry);
  const reader = new BitReader(writer.toBase64Url());

  expect(readEntryFromBits(reader)).toEqual(entry);
});

test('section list round-trips through bit encoding', () => {
  const sections: SectionInfoList = [
    {
      title: 'Keersommen',
      rows: [
        {
          entries: [
            { game: 'A', variant: 'ab', timeCode: 'a' },
            { game: 'AG', variant: 'ak', timeCode: 'b' },
          ],
        },
        {
          entries: [{ game: 'D', variant: 'zz', timeCode: undefined }],
        },
      ],
    },
    {
      title: 'Minsommen',
      rows: [
        {
          entries: [{ game: 'A', variant: 'cd', timeCode: 'c' }],
        },
      ],
    },
  ];

  const encoded = encodeSectionInfoList(sections);
  expect(decodeSectionInfoList(encoded)).toEqual(sections);
});

test('Entry describes a valid game entry payload', () => {
  const entry: Entry = {
    game: 'A',
    variant: 'ab',
    timeCode: 'a',
  };

  expect(entry).toEqual({
    game: 'A',
    variant: 'ab',
    timeCode: 'a',
  });
});

test('Row contains multiple entries in a single section row', () => {
  const row: Row = {
    entries: [
      {
        game: 'A',
        variant: 'ab',
        timeCode: 'a',
      },
      {
        game: 'AG',
        variant: 'ak',
      },
    ],
  };

  expect(row.entries).toHaveLength(2);
  expect(row.entries[0].game).toBe('A');
  expect(row.entries[1].variant).toBe('ak');
});

test('SectionInfoList contains section titles and rows', () => {
  const section: SectionInfo = {
    title: 'Keersommen',
    rows: [
      {
        entries: [
          {
            game: 'A',
            variant: 'ab',
            timeCode: 'a',
          },
        ],
      },
      {
        entries: [
          {
            game: 'AG',
            variant: 'ak',
            timeCode: 'b',
          },
        ],
      },
    ],
  };

  const sections: SectionInfoList = [section];

  expect(sections).toHaveLength(1);
  expect(sections[0].title).toBe('Keersommen');
  expect(sections[0].rows[1].entries[0].timeCode).toBe('b');
});
