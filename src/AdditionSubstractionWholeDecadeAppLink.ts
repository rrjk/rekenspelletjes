export type OperatorAsText = 'plus' | 'minus'; // Type for Operator as text (used in link creation)
export type DecadeLocation = 'decadeFirst' | 'decadeLast';

/** Create link for PlusMinHeleTientallen (sterspel) game
 * @param decadeLocation - Location of the decade (i.e. 10+x or x+10)
 * @param operators - Which operators to use. If none are given, plus will be used.
 * @param time - Game length (seconds)
 */

export function plusMinHeleTientallenLink(
  decadeLocation: DecadeLocation,
  operators: OperatorAsText[],
  time: number,
) {
  let params = `time=${time}`;
  for (const o of operators) params += `&operator=${o}`;
  if (decadeLocation === 'decadeFirst') params += '&decadeFirst'; // For decadeLast no URL parameter is used.
  return `../Rekenspelletjes/PlusMinHeleTientallen.html?${params}`;
}
