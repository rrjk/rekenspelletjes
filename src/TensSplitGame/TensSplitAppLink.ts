/** Create link for ten split game.
 * @param time - Game length
 */

export function splitsenOpWaardeLink(time: number) {
  const params = `time=${time}`;
  return `../Rekenspelletjes/SplitsenOpWaarde.html?${params}`;
}
