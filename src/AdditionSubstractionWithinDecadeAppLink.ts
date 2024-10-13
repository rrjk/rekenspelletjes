export type Decade = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
export type OperatorParam = 'plus' | 'minus';
/** Create link for split number game.
 * @param decades - Decade(s) to create exercizes. (0: 1-10, 10: 11-20, etc). If no decades are provided, 0-10 will be used.
 * @param operators - Operators to use. If no operators are provided, plus will be used.
 * @param time - Game length
 */

export function plusMinBinnenTientalLink(
  decades: Decade[],
  operators: OperatorParam[],
  time: number,
) {
  let params = `time=${time}`;
  for (const d of decades) params += `&decade=${d}`;
  for (const o of operators) params += `&operator=${o}`;

  return `../Rekenspelletjes/PlusMinBinnenTiental.html?${params}`;
}
