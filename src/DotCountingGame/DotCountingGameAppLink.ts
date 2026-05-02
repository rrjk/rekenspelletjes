/** Create link for Stippen tellen game
 * @param countOnly - Only count dots (onlys show one hand if true) (includeDifference is ignored if true)
 * @param includeDifference - Ask for difference in number of dots between the two hands
 * @param time - Game length (seconds)
 */

export function stippenTellenLink(
  countOnly: boolean,
  includeDifference: boolean,
  time: number,
) {
  return `../Rekenspelletjes/StippenTellen.html?countOnly=${countOnly}&includeDifference=${includeDifference}&time=${time}`;
}
