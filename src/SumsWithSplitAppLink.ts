type Operator = 'plus' | 'minus'; // Type for Operator as text (used in link creation)

export type GameRangeType = 'split1Till20' | 'split1Till100' | 'split2Till100';

export type ShowSplitsType = 'showSplits' | 'hideSplits';
/** Create link for Sommen Met Splitsen game
 * @param game - Game to play
 * @param operators - Which operators to use. If none are given, plus will be used.
 * @param time - Game length (seconds)
 */

export function sommenMetSplitsenLink(
  game: GameRangeType,
  operators: Operator[],
  time: number,
  splits?: undefined | ShowSplitsType,
) {
  let params = `time=${time}&game=${game}`;
  if (splits !== undefined) params += `&splits=${splits}`;
  for (const o of operators) params += `&${o}`;
  return `../Rekenspelletjes/SommenMetSplitsen.html?${params}`;
}
