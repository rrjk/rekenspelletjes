export type Operator = '×' | ':';
type Image = 'balloon' | 'rocket' | 'zeppelin';
/** Create link for recognize groups game.
 * @param operators - Operators (× or :) to use. × will be used if empty.
 * @param tables: Tables of multiplication to include. If empty, all tables from 1 till 10 are included.
 * @param image: Image to use in the game
 * @param time - Gamelength
 */

export function ballonnenSpelLink(
  operators: Operator[],
  tables: number[],
  image: Image,
  time: number,
) {
  let params = `time=${time}`;
  for (const o of operators) {
    if (o === '×') params += `&operator=times`;
    else if (o === ':') params += `&operator=divide`;
  }
  for (const t of tables) params += `&table=${t}`;
  params += `&image=${image}`;

  return `../Rekenspelletjes/Ballonnenspel.html?${params}`;
}
