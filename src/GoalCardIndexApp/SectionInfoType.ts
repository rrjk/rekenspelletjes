import { TimeCode } from '../TimeCodes';
import { GameCode, isGameCode } from '../GameCodes';
import { BitWriter, BitReader } from '../BitIO';
import { UnexpectedValueError } from '../UnexpectedValueError';

export type Entry = {
  game: GameCode;
  variant: string;
  timeCode?: TimeCode;
};

export type Row = {
  entries: Entry[];
};

export type SectionInfo = {
  title: string;
  rows: Row[];
};

export type SectionInfoList = SectionInfo[];

const sectionInfoListVersion = 0;

/** Transform a letter (A-Z or a-z) into its corresponding 1-based position in the alphabet.
 * A corresponds to 1, B to 2, ..., Z to 26.
 * @param ch - letter to convert
 * @returns The 1-based position of the letter in the alphabet.
 */
function letterToVal(ch: string): number {
  if (ch.length !== 1 || !/[a-zA-Z]/.test(ch)) {
    throw new Error(`Invalid letter: ${ch}`);
  }
  return ch.toUpperCase().charCodeAt(0) - 64;
}

export function oneOrTwoLetterToVal(code: string): number {
  if (code.length === 1) {
    return letterToVal(code);
  } else if (code.length === 2) {
    const [first, second] = code;
    return letterToVal(first) * 26 + letterToVal(second);
  } else {
    throw new Error(`Invalid code: ${code}`);
  }
}

export function valToOneOrTwoLetter(val: number): string {
  const maxOneLetterValue = 26;
  const maxTwoLetterValue = 26 * 26 + 26;
  if (val === 0) {
    return '';
  } else if (val <= maxOneLetterValue) {
    return String.fromCharCode(64 + val);
  } else if (val <= maxTwoLetterValue) {
    const first = Math.floor((val - 1) / 26); // We extract 1 because the first letter is 1-based, not 0-based.
    const second = val - first * 26;
    return (
      String.fromCharCode(64 + first) + String.fromCharCode(64 + second)
    ).toUpperCase();
  } else {
    throw new Error(`Invalid value for one or two letter code: ${val}`);
  }
}

export function writeGameAsBits(w: BitWriter, gameCode: GameCode) {
  const num = oneOrTwoLetterToVal(gameCode);
  w.write(num, 10);
}

export function readGameFromBits(r: BitReader): GameCode {
  const num = r.read(10);
  const str = valToOneOrTwoLetter(num);
  if (isGameCode(str)) {
    return str;
  } else {
    throw new Error(`Invalid number for game code: ${num}`);
  }
}

export function writeVariantAsBits(w: BitWriter, variantCode: string) {
  if (variantCode.length <= 0 || variantCode.length > 2) {
    throw new Error(`Invalid variant code: ${variantCode}`);
  }
  const num = oneOrTwoLetterToVal(variantCode.toUpperCase());
  w.write(num, 10);
}

export function readVariantFromBits(r: BitReader): string {
  const num = r.read(10);
  return valToOneOrTwoLetter(num).toLowerCase();
}

export function writeTimeCodeAsBits(
  w: BitWriter,
  timeCode: TimeCode | undefined,
) {
  switch (timeCode) {
    case undefined:
      w.write(0, 2);
      return;
    case 'a':
      w.write(1, 2);
      return;
    case 'b':
      w.write(2, 2);
      return;
    case 'c':
      w.write(3, 2);
      return;
    default:
      throw new UnexpectedValueError(timeCode, `Invalid time code`);
  }
}

export function readTimeCodeFromBits(r: BitReader): TimeCode | undefined {
  const num = r.read(2);
  switch (num) {
    case 0:
      return undefined;
    case 1:
      return 'a';
    case 2:
      return 'b';
    case 3:
      return 'c';
    default:
      throw new Error(`SW error, with two bits this cannot be reached`);
  }
}

const titleAsBitsEscapeCode = 127; // Outside the printable ASCII range (32-126)

export function writeSectionTitleAsBits(w: BitWriter, sectionTitle: string) {
  if (sectionTitle.length > 64) {
    throw new Error(`Section title too long: ${sectionTitle}`);
  }
  w.write(sectionTitle.length, 6); // Up to 64 characters.
  for (const ch of sectionTitle) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code <= 126) {
      // Within printable ASCII range
      w.write(code, 7);
    } else {
      w.write(titleAsBitsEscapeCode, 7);
      const bytes = new TextEncoder().encode(ch);
      w.write(bytes.length, 3);
      for (const byte of bytes) {
        w.write(byte, 8);
      }
    }
  }
}

export function readSectionTitleFromBits(r: BitReader): string {
  const length = r.read(6);
  let sectionTitle = '';
  for (let i = 0; i < length; i++) {
    const code = r.read(7);
    if (code === titleAsBitsEscapeCode) {
      const byteLength = r.read(3);
      const bytes = new Uint8Array(byteLength);
      for (let j = 0; j < byteLength; j++) {
        bytes[j] = r.read(8);
      }
      sectionTitle += new TextDecoder().decode(bytes);
    } else {
      sectionTitle += String.fromCharCode(code);
    }
  }
  return sectionTitle;
}

export function writeEntryAsBits(w: BitWriter, entry: Entry) {
  writeGameAsBits(w, entry.game);
  writeVariantAsBits(w, entry.variant);
  writeTimeCodeAsBits(w, entry.timeCode);
}

export function readEntryFromBits(r: BitReader): Entry {
  const game = readGameFromBits(r);
  const variant = readVariantFromBits(r);
  const timeCode = readTimeCodeFromBits(r);
  return { game, variant, timeCode };
}

export function encodeSectionInfoList(sections: SectionInfoList): string {
  const w = new BitWriter();
  w.write(sectionInfoListVersion, 4); // Write the version (3 bits should be enough for small version numbers)

  const nmbrSections = sections.length;
  if (nmbrSections > 15) {
    // 4 bits can represent up to 15 sections
    throw new Error(`Too many sections: ${nmbrSections}`);
  }
  w.write(nmbrSections, 4);

  for (const section of sections) {
    writeSectionTitleAsBits(w, section.title);
    const nmbrRows = section.rows.length;
    if (nmbrRows > 31) {
      // 5 bits can represent up to 31 rows
      throw new Error(`Too many rows: ${nmbrRows}`);
    }
    w.write(nmbrRows, 5);
    for (const row of section.rows) {
      const nmbrEntries = row.entries.length;
      if (nmbrEntries !== 1 && nmbrEntries !== 2) {
        // Only 1 or 2 entries allowed, 1 bit is enough
        throw new Error(`Too many entries: ${nmbrEntries}`);
      }
      w.write(nmbrEntries - 1, 1);
      for (const entry of row.entries) {
        writeEntryAsBits(w, entry);
      }
    }
  }
  return w.toBase64Url();
}

export function decodeSectionInfoList(encoded: string): SectionInfoList {
  const r = new BitReader(encoded);
  const version = r.read(4);
  if (version !== sectionInfoListVersion) {
    throw new Error(`Unsupported version: ${version}`);
  }

  const nmbrSections = r.read(4);
  const sections: SectionInfoList = [];
  for (let i = 0; i < nmbrSections; i++) {
    const title = readSectionTitleFromBits(r);
    const nmbrRows = r.read(5);
    const rows: Row[] = [];
    for (let j = 0; j < nmbrRows; j++) {
      const nmbrEntries = r.read(1) + 1;
      const entries: Entry[] = [];
      for (let k = 0; k < nmbrEntries; k++) {
        entries.push(readEntryFromBits(r));
      }
      rows.push({ entries });
    }
    sections.push({ title, rows });
  }
  return sections;
}
