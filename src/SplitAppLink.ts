/** Create link for split number game.
 * @param numbers - Numbers to show. If emptry 10 will be used.
 * @param time - Game length
 */

export function splitsenLink(numbers: number[], time: number) {
  let params = `time=${time}`;
  for (const n of numbers) params += `&number=${n}`;

  return `../Rekenspelletjes/SplitsenV2.html?${params}`;
}
