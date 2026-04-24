export type Operator = 'times' | 'divide';

/** Create link for tables ot multiplication game
 * @param operators - Operators (times or divide to use. times will be used if empty.
 * @param tables: Tables of multiplication to include. If empty, all tables from 1 till 10 are included.
 * @param time - Gamelength
 */

export function multiplicationTablesGameLinkV2(
  operators: Operator[],
  tables: number[],
  time: number,
) {
  let params = `time=${time}`;
  for (const o of operators) {
    params += `&operator=${o}`;
  }
  for (const t of tables) params += `&table=${t}`;

  return `../Rekenspelletjes/TafeltjesOefenenSpel.html?${params}`;
}
