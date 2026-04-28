export type FractionPairMatchingGameType =
  | 'fractionToPie'
  | 'equalFractions'
  | 'fractionToDecimal'
  | 'fractionToPercentage'
  | 'percentageToDecimal'
  | 'percentageToPie';

/** Create link for fraction pair matchinggame.
 * @param gameType - game type
 * @param time - Gamelength
 */

export function breukenPaartjesLink(
  gameType: FractionPairMatchingGameType,
  time: number,
) {
  let params = `time=${time}`;
  params += `&gameType=${gameType}`;

  return `../Rekenspelletjes/BreukenPaartjesSpel.html?${params}`;
}
