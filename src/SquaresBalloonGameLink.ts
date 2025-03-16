export type Operator = 'square' | 'root';
/** Create link for recognize groups game.
 * @param operators - Operators (× or :) to use. × will be used if empty.
 * @param time - Gamelength
 */

export function ballonnenSpelLink(operators: Operator[], time: number) {
  let params = `time=${time}`;
  for (const o of operators) {
    params += `&operator=${o}`;
  }
  return `../Rekenspelletjes/Hexagonnenspel.html?${params}`;
}
