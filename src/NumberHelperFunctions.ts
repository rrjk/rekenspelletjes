/** Return number of decimal digits in number */
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

/** Actibe digits to number */
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
