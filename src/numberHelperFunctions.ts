/** Return number of decimal digits in number */
export function numberDigitsInNumber(nmbr: number): number {
  if (nmbr === 0) return 1;
  return Math.ceil(Math.log10(Math.abs(nmbr) + 1));
}

export function determineRequiredDigit(
  finalNumber: number,
  partialNumber: number | undefined,
) {
  if (finalNumber === partialNumber) {
    throw Error(`final and partialNumber are equal in determineRequireDigit`);
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
