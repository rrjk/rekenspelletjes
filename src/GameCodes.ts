export type GameInfoType = {
  gameCode: string;
  name: string;
};

export const gameCodes: GameInfoType[] = [
  { gameCode: 'A', name: 'Vliegerspel: Plus- en minsommen binnen het tiental' },
  {
    gameCode: 'B',
    name: 'Sterrenspel: Plus- en minsommen met hele tientallen',
  },
  {
    gameCode: 'C',
    name: 'Raketspel: Deelsommen en keer- en deelsommen door elkaar',
  },
  { gameCode: 'D', name: 'Balonnenspel: Keersommen' },
  { gameCode: 'E', name: 'Sorteerspel (tot 100)' },
  { gameCode: 'F', name: 'Groepjes van spel' },
  { gameCode: 'G', name: 'Sommen met één keer splitsen' },
  {
    gameCode: 'H',
    name: 'Getallenrij: klik op de ballen in de juiste volgorde',
  },
  { gameCode: 'I', name: 'Breuken paartjes zoeken' },
  { gameCode: 'J', name: 'Eierdoos tellen' },
  { gameCode: 'K', name: 'Zeppelinspel:Keersommen boven de 10' },
  { gameCode: 'L', name: 'Klokkenspel' },
  {
    gameCode: 'M',
    name: 'Vliegende schotel spel: Keer- en deelsommen boven de 10',
  },
  {
    gameCode: 'N',
    name: 'Verliefde harten: Combineer door te slepen en los de som op',
  },
  { gameCode: 'O', name: 'Welke hand heeft meer stippen' },
  {
    gameCode: 'P',
    name: 'Ballenknallen: Ballen aanklikken in volgorde van een tafel',
  },
  {
    gameCode: 'Q',
    name: 'Ballenknallen met som : Ballen aanklikken n.a.v. een keersom',
  },
  { gameCode: 'R', name: 'Vogelspel (nu nog ballon): Splitsen van getallen' },
  { gameCode: 'S', name: 'Sorteerspel (diverse)' },
  { gameCode: 'T', name: 'Foto kiezen die aan de getallenlijn hangt' },
  { gameCode: 'U', name: 'Jan op de getallenlijn laten springen' },
  { gameCode: 'V', name: 'Sommen met dubbel splitsen' },
  { gameCode: 'W', name: 'Tiental Afsplitsen' },
  { gameCode: 'X', name: 'Getallenlijn boogjes spel' },
  { gameCode: 'Y', name: 'Hexagonnen (kwadraten en wortels) spel' },
  { gameCode: 'Z', name: 'Deelsommen met splitsen' },
  { gameCode: 'AA', name: 'Dobbelsteen spel' },
  { gameCode: 'AB', name: 'Hoeveel vingers spel' },
  { gameCode: 'AC', name: 'Gemengde sommen met puzzel' },
  { gameCode: 'AD', name: 'Gemengde sommen zonder puzzel' },
];

export function getGameDescription(gameCode: string): string {
  let retValue = '';
  const gameInfo = gameCodes.find(el => el.gameCode === gameCode);
  if (gameInfo !== undefined) retValue = gameInfo.name;
  else retValue = '';
  return retValue;
}

export function getGameCodes(): string[] {
  const retValue: string[] = [];
  for (const gc of gameCodes) {
    retValue.push(gc.gameCode);
  }
  return retValue;
}
