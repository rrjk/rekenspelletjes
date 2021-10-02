/**
 * Return a random integer in the range [min, max]
 * @param {number} min
 * @param {number} max
 * @returns {number} randomNumber
 */
export function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a random element from an array
 * @param {arrayOfPossibleValues} array with teh possible values
 * @returns {number} random element from the arrayOfPossibleValues.
 */
export function randomFromSet(arrayOfPossibleValues) {
  const numberOfPossibleValues = arrayOfPossibleValues.length;
  const selectedIndex = randomIntFromRange(0, numberOfPossibleValues - 1);
  return arrayOfPossibleValues[selectedIndex];
}
