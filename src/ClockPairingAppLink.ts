export type TimeTypes =
  | 'Hour'
  | 'HalfHour'
  | 'QuarterHour'
  | '10Minute'
  | 'Minute';
export type ClockTypes = 'Analog' | 'Digital' | 'Sentence';
/** Create link for clock pairing game.
 * @param timeTypes - Timetypes to use in the game. If none are provided, hour, halfhour and quaterhour are mixed.
 * @param clockType - Clocktypes to use in the game. If none are provided, analog and setence are used.
 * @param time - Game length
 */

export function klokPaartjesLink(
  timeTypes: TimeTypes[],
  clockTypes: ClockTypes[],
  time: number,
) {
  let params = `time=${time}`;
  for (const t of timeTypes) params += `&${t}`;
  for (const c of clockTypes) params += `&${c}`;
  return `../Rekenspelletjes/KlokPaartjes.html?${params}`;
}
