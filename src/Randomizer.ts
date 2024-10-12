/**
 * Return a random integer in the range [min, max]
 */
export function randomIntFromRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a random element from an array
 * @param Array with the possible values to select from
 * @returns random element from the arrayOfPossibleValues.
 */
export function randomFromSet<T>(arrayOfPossibleValues: T[]): T {
  const numberOfPossibleValues = arrayOfPossibleValues.length;
  const selectedIndex = randomIntFromRange(0, numberOfPossibleValues - 1);
  return arrayOfPossibleValues[selectedIndex];
}

/** Return a random element from an array and remove that element from the array
 * @param arrayOfPossibleValues array with possible values to select from. Will be spliced.
 * @returns random element from the arrayOfPossibleValues
 */
export function randomFromSetAndSplice<T>(arrayOfPossibleValues: T[]): T {
  return arrayOfPossibleValues.splice(
    randomIntFromRange(0, arrayOfPossibleValues.length - 1),
    1,
  )[0];
}

/** Shuffle an array in place
 * @param array Array to be shuffled in place
 */
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
