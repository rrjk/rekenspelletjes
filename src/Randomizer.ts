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

export function* rangeWithGaps(
  from: number,
  to: number,
  excludeList: number[],
) {
  for (let i = from; i < to; i++) {
    if (!excludeList.includes(i)) {
      yield i;
    }
  }
}

export function splitInConsecutiveRanges(orig: number[]): number[][] {
  const ret: number[][] = [];
  let subRange: number[] = [];
  const origCopy = [...orig];
  origCopy.sort((a, b) => b - a);

  let previous = Number.NaN;

  while (origCopy.length > 0) {
    const current: number = origCopy.pop() as number; // As the length > 0, we're sure we'll get an element back.
    if (current !== previous) {
      if (Number.isNaN(previous) || current - previous !== 1) {
        if (subRange.length > 0) ret.push(subRange);
        subRange = [];
      }
      subRange.push(current);
      previous = current;
    }
  }
  if (subRange.length > 0) ret.push(subRange);
  return ret;
}

export function numberArrayToRangeText(orig: number[]): string {
  const rangesAsString: string[] = [];
  const ranges = splitInConsecutiveRanges(orig);

  for (const range of ranges) {
    if (range.length === 1) {
      rangesAsString.push(`${range[0]}`);
    }
    if (range.length === 2) {
      rangesAsString.push(`${range[0]}, ${range[1]}`);
    }
    if (range.length > 2) {
      rangesAsString.push(`${range[0]} tot en met ${range[range.length - 1]}`);
    }
  }

  let ret: string;
  ret = rangesAsString.join(`, `);
  ret = ret.replace(/,(?!.*,)/, ' en'); // Replace the last occurance of "," by "en "
  return ret;
}
