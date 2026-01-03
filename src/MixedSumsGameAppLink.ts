import { Operator } from './Operator';

/** Create link for mixed sums game
 * @param operators - Operators to use
 * @param maxAnswer - maximum answer for plus and minus sums
 * @param maxTable - maximum table to use for times and divide
 * @param puzzle - include a rewards puzzle
 * @param time - game time in seconds
 */
export function mixedSumsGameLink(
  operators: Operator[],
  maxAnswer: number,
  maxTable: number,
  puzzle: boolean,
  time: number,
) {
  let params = `time=${time}`;
  for (const o of operators) {
    params += `&operator=${o}`;
  }
  params += `&maxAnswer=${maxAnswer}`;
  params += `&maxTable=${maxTable}`;
  if (!puzzle) params += `&excludePuzzle`;
  return `../Rekenspelletjes/GemengdeSommen.html?${params}`;
}
