import { customElement } from 'lit/decorators.js';

import { GoalCardIndexApp, type IndexPage } from './GoalCardIndexApp';
import { isTimeCode } from '../TimeCodes';

import { renderMixedSumsGameHourglassGameIcon } from '../MixedSumsGame/MixedSumsHourglassGameIcon';
import { renderAdditionSubstractionWithinDecadeGameHourglassGameIcon } from '../AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameHourglassGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';
import { renderSplitBalloonGameHourglassGameIcon } from '../SplitBalloonGame/SplitBalloonGameHourglassGameIcon';
import { renderSumsWithSplitGameHourglassGameIcon } from '../SumsWithSplitGame/SumsWithSplitGameHourglassGameIcon';
import { renderMultiplicationTablesBalloonHourglassGameIcon } from '../MultiplicationTablesBalloonGame/MultiplicationTablesBalloonHourglassGameIcon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = ['R', 'A', 'AG', 'G', 'D', 'AE'] as const;
// R - split-game
// A - addition-substraction within decade game
// AG - mixed sums game (sumtype)
// AE - mixed sums game (multiplication)
// G - sums with split game (one split)
// D - multiplication tables balloon game
export type Game = (typeof game)[number];

export type GameCode = string;

@customElement('custom-index-app')
export class CustomIndexApp extends GoalCardIndexApp<GameCode> {
  private parsedSections: IndexPage<GameCode> = { defaultPage: [] };

  parseUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const sections: IndexPage<GameCode>['defaultPage'] = [];

    const sectionsParameter = urlParams.get('d');
    for (const sectionParameter of sectionsParameter?.split('_') ?? []) {
      const sectionParts = sectionParameter.split('*');
      if (sectionParts.length !== 2 || !sectionParts[0] || !sectionParts[1]) {
        throw new Error(`Invalid section parameter: ${sectionParameter}`);
      }

      const section = {
        title: sectionParts[0],
        rows: sectionParts[1].split('~').map(row => ({
          entries: row.split('.').map(entry => {
            const entryParts = entry.split('-');
            const [game, variant, timeCode] = entryParts;
            if (
              entryParts.length !== 3 ||
              !game ||
              !variant ||
              !timeCode ||
              !isTimeCode(timeCode)
            ) {
              throw new Error(`Invalid section entry: ${entry}`);
            }

            return {
              game,
              variant,
              timeCode,
            };
          }),
        })),
      };

      const existingSectionIndex = sections.findIndex(
        existingSection => existingSection.title === section.title,
      );
      if (existingSectionIndex === -1) {
        sections.push(section);
      } else {
        sections[existingSectionIndex] = section;
      }
    }

    this.parsedSections = { defaultPage: sections };
  }

  get sections(): IndexPage<GameCode> {
    return this.parsedSections;
  }

  constructor() {
    super();
    this.parseUrlParameters();
  }

  get pageTitle(): string {
    return `Doelenkaart Silvester Bernadette  groep 6`;
  }

  iconFunctions: Record<Game, RenderGameIconFunction> = {
    A: renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
    AG: renderMixedSumsGameHourglassGameIcon,
    AE: renderMixedSumsGameHourglassGameIcon,
    R: renderSplitBalloonGameHourglassGameIcon,
    G: renderSumsWithSplitGameHourglassGameIcon,
    D: renderMultiplicationTablesBalloonHourglassGameIcon,
  };
}
