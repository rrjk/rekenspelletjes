/** Return number of decimal digits in number */
export type NumberRange = { min: number; max: number };

export function numberDigitsInNumber(nmbr: number): number {
  if (nmbr === 0) return 1;
  return Math.ceil(Math.log10(Math.abs(nmbr) + 1));
}

/** Split a number in digits */
export function splitInDigits(nmbr: number): number[] {
  const ret: number[] = [];
  const nmbrDigits = numberDigitsInNumber(nmbr);
  let rest = nmbr;
  while (rest !== 0) {
    const digit = rest % 10;
    rest = (rest - digit) / 10;
    ret.push(digit);
  }
  while (ret.length < nmbrDigits) ret.push(0);
  ret.reverse();
  return ret;
}

/** Active digits to number */
export function numberWithActiveDigits(
  nmbr: number,
  activeDigits: number,
): string {
  if (activeDigits === 0) return '';

  const maxNmbrDigits = numberDigitsInNumber(nmbr);
  if (activeDigits >= maxNmbrDigits) return `${nmbr}`;
  return `${Math.floor(nmbr / 10 ** (maxNmbrDigits - activeDigits))}`;
}

/** Determine the next required digit, given that a partial answer is already provided */
export function determineRequiredDigit(
  finalNumber: number,
  partialNumber: number | undefined,
) {
  if (finalNumber === partialNumber) {
    throw Error(
      `final (${finalNumber} and partialNumber (${partialNumber}) are equal in determineRequireDigit`,
    );
  }
  const numberDigitsFinalNumber = numberDigitsInNumber(finalNumber);
  const numberDigitsPartialNumber =
    partialNumber === undefined ? 0 : numberDigitsInNumber(partialNumber);

  const weightedPartialNumber =
    partialNumber === undefined
      ? 0
      : partialNumber *
        10 ** (numberDigitsFinalNumber - numberDigitsPartialNumber);
  const toDoNumber = finalNumber - weightedPartialNumber;
  const numberDigitsToDoNumber = numberDigitsInNumber(toDoNumber);
  const weightLeftDigitToDoNumber = 10 ** (numberDigitsToDoNumber - 1);
  const nextDigit = Math.floor(toDoNumber / weightLeftDigitToDoNumber);
  return nextDigit;
}

export function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

export function getRange(lowest: number, highest: number): number[];
export function getRange(range: NumberRange): number[];
export function getRange(
  lowestOrRange: number | NumberRange,
  highest?: number,
): number[] {
  let range: NumberRange;

  if (typeof lowestOrRange === 'object') {
    range = lowestOrRange;
  } else if (typeof lowestOrRange === 'number' && typeof highest === 'number') {
    range = { min: lowestOrRange, max: highest };
  } else {
    throw new Error(
      'Invalid arguments provided to getRange. Provide either a NumberRange or two numbers (lowest and highest).',
    );
  }
  const ret: number[] = [];
  for (let i = range.min; i <= range.max; i++) {
    ret.push(i);
  }
  return ret;
}

export function inRange(range: NumberRange, value: number): boolean {
  return value >= range.min && value <= range.max;
}

/*
export function getRange(lowest: number, highest: number): number[] {
  const ret: number[] = [];
  for (let i = lowest; i <= highest; i++) {
    ret.push(i);
  }
  return ret;
}
*/

export function splitInContiguousRanges(numbers: number[]): [number, number][] {
  if (numbers.length === 0) return [];
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const ranges: [number, number][] = [];
  let rangeStart = sortedNumbers[0];
  let rangeEnd = sortedNumbers[0];

  for (let i = 1; i < sortedNumbers.length; i++) {
    const currentNumber = sortedNumbers[i];
    if (currentNumber === rangeEnd + 1) {
      // Extend the current range
      rangeEnd = currentNumber;
    } else {
      // Close the current range and start a new one
      ranges.push([rangeStart, rangeEnd]);
      rangeStart = currentNumber;
      rangeEnd = currentNumber;
    }
  }
  // Push the last range
  ranges.push([rangeStart, rangeEnd]);

  return ranges;
}
