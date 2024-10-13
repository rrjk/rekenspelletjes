type IncludeAnswer = 'includeAnswer' | 'excludeAnswer';
type IncludeLongAddition = 'includeLongAddition' | 'excludeLongAddition';
/** Create link for recognize groups game.
 * @param includeAnswer - Include answer or not.
 * @param includeLongAddition - Include long addition or not.
 * @param time - Gamelength
 */

export function groepjesVanHerkennenLink(
  includeAnswer: IncludeAnswer,
  includeLongAddition: IncludeLongAddition,
  time: number,
) {
  let params = `time=${time}`;
  if (includeAnswer === 'includeAnswer') params += '&includeAnswer';
  else if (includeAnswer === 'excludeAnswer') params += '&excludeAnswer';
  if (includeLongAddition === 'includeLongAddition')
    params += '&includeLongAddition';
  else if (includeLongAddition === 'excludeLongAddition')
    params += '&excludeLongAddition';

  return `../Rekenspelletjes/GroepjesVanHerkennen.html?${params}`;
}
