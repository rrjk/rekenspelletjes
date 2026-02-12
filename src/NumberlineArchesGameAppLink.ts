export type OperatorType = 'plus' | 'minus';
export type SplitType = 'split' | 'noSplit';
export type JumpsOfTenType = 'jumpsOfTen' | 'noJumpsOfTen';
export type CrossTenType = 'never' | 'noSplitAndTens' | 'always' | 'optional';

/** Create link for numberline arches game.
 * @param min - Minumum number for the sums (min > 0 and multiple of 10).
 * @param max - Maximum number for the sums (max > min and multiple of 10).
 * @param minNumberline - Minumum number for the numberline (0 <= minNumberline <= min and multiple of 10).
 * @param maxNumberline - Maximum number for the numberline (maxNumberline >= max and multiple of 10).
 * @param time - Gamelength
 */

export function getallenlijnBoogjesSpelLink(
  min: number,
  max: number,
  minNumberline: number,
  maxNumberline: number,
  split: SplitType,
  jumpsOfTen: JumpsOfTenType,
  time: number,
  operator: OperatorType,
) {
  if (min % 10 !== 0) throw new RangeError(`Min should be a multiple of 10`);
  if (max % 10 !== 0) throw new RangeError(`Max should be a multiple of 10`);
  if (minNumberline % 10 !== 0)
    throw new RangeError(`minNumberline should be a multiple of 10`);
  if (maxNumberline % 10 !== 0)
    throw new RangeError(`maxNumberline should be a multiple of 10`);
  if (min >= max) throw new RangeError('min should be smaller than max');
  if (minNumberline > min || minNumberline < 0)
    throw RangeError('minNumberline should be between (or equal to) 0 and min');
  if (maxNumberline < max)
    throw RangeError('maxNumberline should be at least max');

  const params = `time=${time}&min=${min}&max=${max}&minNumberline=${minNumberline}&maxNumberline=${maxNumberline}&split=${split}&jumpsOfTen=${jumpsOfTen}&operator=${operator}`;
  return `../Rekenspelletjes/GetallenlijnBoogjesSpel.html?${params}`;
}
