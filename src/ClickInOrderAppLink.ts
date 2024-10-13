type Descending = 'descending' | 'ascending';
type ShowSum = 'showSum' | 'hideSum';
type EvenOdd = 'even' | 'odd' | 'all';
type Start = 'random' | number;
/** Create link for click in table of multiplication order game
 * @param nmbrBalls - Number of balls  to show
 * @param tableOfMultiplication - create balls from the tableOfMultiplication, if showSum is not active, only the first table is selected.
 * @param showSum: Show sum with the table of multiplication(s), in this case the balls need to be clicked in the order the sums are shown (random), multiple tables are allowed.
 * @param time - Game length
 */

export function aanklikkenInTafelVolgordeLink(
  nmbrBalls: number,
  tableOfMultiplication: number[],
  showSum: ShowSum,
) {
  let params = `nmbrBalls=${nmbrBalls}`;
  if (showSum === 'showSum') params += `&showSum`;
  for (const n of tableOfMultiplication)
    params += `&tableOfMultiplication=${n}`;
  return `../Rekenspelletjes/AanklikkenInVolgorde.html?${params}`;
}
/** Create link for click in order game.
 * @param nmbrBalls - Number of balls  to show
 * @param start - First number to show, or random to randomly select from 20 - 80
 * @param descending - use descending numbers when start is specified
 * @param random: Select number from a random start number, increasing by 1.
 * @param evenOdd: What number to show (even/ odd/ all)
 */

export function aanklikkenInVolgordeLink(
  start: Start,
  nmbrBalls: number,
  descending: Descending,
  evenOdd: EvenOdd,
) {
  let params = `nmbrBalls=${nmbrBalls}`;
  if (start === 'random') params += '&random';
  else params += `&start=${start}`;
  if (descending === 'descending') params += `&descending`;
  if (evenOdd === 'even') params += `&even`;
  else if (evenOdd === 'odd') params += `&odd`;
  return `../Rekenspelletjes/AanklikkenInVolgorde.html?${params}`;
}
