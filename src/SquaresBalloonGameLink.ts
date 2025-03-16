export type Operator = 'square' | 'root';
/** Create link for recognize groups game.
 * @param operators - Operators (× or :) to use. × will be used if empty.
 * @param time - Gamelength
 */

export function hexagonnenSpelLink(
  operators: Operator[],
  maxBase: number,
  time: number,
) {
  let params = `time=${time}`;
  for (const o of operators) {
    params += `&operator=${o}`;
  }
  params += `&maxBase=${maxBase}`;
  return `../Rekenspelletjes/Hexagonnenspel.html?${params}`;
}
