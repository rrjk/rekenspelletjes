import { customElement } from 'lit/decorators.js';

import { type IndexPageType, GoalCardIndexApp } from './GoalCardIndexApp';

import { renderMixedSumsGameHourglassGameIcon } from '../MixedSumsGame/MixedSumsHourglassGameIcon';
import { renderAdditionSubstractionWithinDecadeGameHourglassGameIcon } from '../AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameHourglassGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';
import { renderSplitBalloonGameHourglassGameIcon } from '../SplitBalloonGame/SplitBalloonGameHourglassGameIcon';
import { renderSumsWithSplitGameHourglassGameIcon } from '../SumsWithSplitGame/SumsWithSplitGameHourglassGameIcon';
import { renderMultiplicationTablesBalloonHourglassGameIcon } from '../MultiplicationTablesBalloonGame/MultiplicationTablesBalloonHourglassGameIcon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = [
  'split-game',
  'addition-substraction-within-decade',
  'mixed-sums',
  'sums-with-split',
  'balloon-game',
] as const;

export type Game = (typeof game)[number];

@customElement('sumtype-index-app-631b663a-fef2-4656-8279-1deeb397e071')
export class SumTypeIndexApp631b663afef2465682791deeb397e071 extends GoalCardIndexApp<Game> {
  get pageTitle(): string {
    return `Doelenkaart Silvester-Bernadette Bovenbouw`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [
        {
          title: 'Rekenspelletjes',
          rows: [
            {
              entries: [
                {
                  game: 'split-game',
                  variant: 'bc',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'addition-substraction-within-decade',
                  variant: 'aa',
                  timeCode: 'a',
                },
                {
                  game: 'mixed-sums',
                  variant: 'ia',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'addition-substraction-within-decade',
                  variant: 'ba',
                  timeCode: 'a',
                },
                {
                  game: 'mixed-sums',
                  variant: 'id',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'sums-with-split',
                  variant: 'aa',
                  timeCode: 'a',
                },
                {
                  game: 'mixed-sums',
                  variant: 'ig',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'mixed-sums',
                  variant: 'ja',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'mixed-sums',
                  variant: 'jb',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'addition-substraction-within-decade',
                  variant: 'ab',
                  timeCode: 'a',
                },
                {
                  game: 'mixed-sums',
                  variant: 'ib',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'addition-substraction-within-decade',
                  variant: 'bb',
                  timeCode: 'a',
                },
                {
                  game: 'mixed-sums',
                  variant: 'ie',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'sums-with-split',
                  variant: 'ab',
                  timeCode: 'a',
                },
                {
                  game: 'mixed-sums',
                  variant: 'ih',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'mixed-sums',
                  variant: 'jc',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'mixed-sums',
                  variant: 'jd',
                  timeCode: 'a',
                },
              ],
            },
            {
              entries: [
                {
                  game: 'balloon-game',
                  variant: 'ak',
                  timeCode: 'b',
                },
                {
                  game: 'mixed-sums',
                  variant: 'ck',
                  timeCode: 'b',
                },
              ],
            },
          ],
        },
      ],
    };
  }
  /*            
           






 


          ],
        },
      ],
    };*/

  iconFunctions: Record<Game, RenderGameIconFunction> = {
    'addition-substraction-within-decade':
      renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
    'mixed-sums': renderMixedSumsGameHourglassGameIcon,
    'split-game': renderSplitBalloonGameHourglassGameIcon,
    'balloon-game': renderMultiplicationTablesBalloonHourglassGameIcon,
    'sums-with-split': renderSumsWithSplitGameHourglassGameIcon,
  };
}
