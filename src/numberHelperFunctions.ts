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
  console.log(
    `determineRequiredDigit finalNumber=${finalNumber}, partialNumber=${partialNumber}`,
  );
  const numberDigitsFinalNumber = numberDigitsInNumber(finalNumber);
  console.log(
    `determineRequiredDigit numberDigitsFinalNumber=${numberDigitsFinalNumber}`,
  );
  const numberDigitsPartialNumber =
    partialNumber === undefined ? 0 : numberDigitsInNumber(partialNumber);
  console.log(
    `determineRequiredDigit numberDigitsPartialNumber=${numberDigitsPartialNumber}`,
  );

  const weightedPartialNumber =
    partialNumber === undefined
      ? 0
      : partialNumber *
        10 ** (numberDigitsFinalNumber - numberDigitsPartialNumber);
  console.log(
    `determineRequiredDigit weightedPartialNumber=${weightedPartialNumber}`,
  );
  const toDoNumber = finalNumber - weightedPartialNumber;
  console.log(`determineRequiredDigit toDoNumber=${toDoNumber}`);
  const numberDigitsToDoNumber = numberDigitsInNumber(toDoNumber);
  console.log(
    `determineRequiredDigit numberDigitsToDoNumber=${numberDigitsToDoNumber}`,
  );
  const weightLeftDigitToDoNumber = 10 ** (numberDigitsToDoNumber - 1);
  console.log(
    `determineRequiredDigit weightLeftDigitToDoNumber=${weightLeftDigitToDoNumber}`,
  );
  const nextDigit = Math.floor(toDoNumber / weightLeftDigitToDoNumber);
  console.log(`determineRequiredDigit nextDigit=${nextDigit}`);
  return nextDigit;
}
