/** Create link for numberline arches game.
 * @param min - Minumum number numberline (min > 0 and multiple of 10).
 * @param max - Minumum number numberline (max > min and multiple of 10).
 * @param time - Gamelength
 */

export function getallenlijnBoogjesSpelLink(
  min: number,
  max: number,
  time: number,
) {
  console.assert(min % 10 === 0);
  console.assert(max % 10 === 0);
  console.assert(max > min);
  const params = `time=${time}&min=${min}&max=${max}`;
  return `../Rekenspelletjes/GetallenlijnBoogjesSpel.html?${params}`;
}
