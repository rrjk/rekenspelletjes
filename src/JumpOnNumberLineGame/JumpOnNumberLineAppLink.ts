type Helpers =
  | 'show10TickMarks'
  | 'show5TickMarks'
  | 'show1TickMarks'
  | 'showAll10Numbers';
type NumberLineBoundaries =
  | 0
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100;
/** Create link for click the right photo on numberline game.
 * @param minimum - Minimum number to show on numberline
 * @param maximum - Maximum number to show on numberline
 * @param showHelpers - What helpers to show
 * @param time - Game length
 */

export function springOpGetallenlijnLink(
  minimum: NumberLineBoundaries,
  maximum: NumberLineBoundaries,
  helpers: Helpers[],
  time: number,
) {
  let params = `time=${time}&minimum=${minimum}&maximum=${maximum}`;
  for (const h of helpers) params += `&${h}`;
  return `../Rekenspelletjes/SpringOpGetallenlijn.html?${params}`;
}
