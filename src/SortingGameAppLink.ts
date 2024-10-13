export type BoxColor = 'red' | 'blue' | 'purple';
/** Create link for sorting game.
 * @param numberBoxes - Number of boxes to show
 * @param minumumValue - Lowest value to show (integer)
 * @param maximumValue - Highest value to show (integer)
 * @param divider - Divider to use (used to create a sorting game with fractions) - Default on url in 1
 * @param boxColor - Color of the boxes - Default on url is red
 * @param time - Game length
 */

export function sorterenLink(
  numberBoxes: 2 | 3 | 4,
  minimumValue: number,
  maximumValue: number,
  divider: number,
  boxColor: BoxColor,
  time: number,
) {
  return `../Rekenspelletjes/Sorteren.html?numberBoxes=${numberBoxes}&minimumValue=${minimumValue}&maximumValue=${maximumValue}&divider=${divider}&boxColor=${boxColor}&time=${time}`;
}
