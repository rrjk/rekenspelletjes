/** Create link for clock pairing game.
 * @param time - Game length
 */

export function dieFaceGameAppLink(time: number) {
  const params = `time=${time}`;
  return `../Rekenspelletjes/DobbelsteenSpel.html?${params}`;
}
