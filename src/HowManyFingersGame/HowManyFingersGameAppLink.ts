export type PossibleNumberFingers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Create link for how many fingers game.
 * @param time - Game length
 * @param min - Minimum number of fingers >= 1
 * @param max - Maximum number of fingers <= 10
 */

export function howManyFingersGameAppLink(
  time: number,
  min: PossibleNumberFingers,
  max: PossibleNumberFingers,
) {
  const params = `time=${time}&min=${min}&max=${max}`;
  return `../Rekenspelletjes/HoeveelVingersSpel.html?${params}`;
}
