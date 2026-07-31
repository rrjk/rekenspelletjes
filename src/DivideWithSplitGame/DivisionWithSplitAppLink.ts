type Decade = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

/** Create link for division with splitgame
 * @param decades: Decades to allow as first sub answer
 * @param hideHelp: whether to hide help text
 * @param hideSubAnswers: whether to hide subanswers
 * @param time - Gamelength
 */

export function divisionWithSplitAppLink(
  decades: Decade[],
  hideHelp: boolean,
  hideSubAnswers: boolean,
  time: number,
) {
  let params = `time=${time}`;
  for (const decade of decades) {
    params += `&decade=${decade}`;
  }
  if (hideHelp) params += '&hideHelpText';
  if (hideSubAnswers) params += '&hideSubAnswers';

  return `../Rekenspelletjes/DelenMetSplitsen.html?${params}`;
}
