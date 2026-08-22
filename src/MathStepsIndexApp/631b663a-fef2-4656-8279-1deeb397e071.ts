import { customElement } from 'lit/decorators.js';

import { SumTypeIndexApp, IndexPageType } from './sumTypeIndexApp';

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
export class SumTypeIndexApp631b663afef2465682791deeb397e071 extends SumTypeIndexApp<Game> {
  get pageTitle(): string {
    return `Doelenkaart Silvester Bernadette  groep 6`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [
        {
          title: 'Rekenspelletjes',
          rows: [
            {
              game: 'split-game',
              variant: 'bc',
              timeCodes: ['a'],
            },
            {
              game: 'addition-substraction-within-decade',
              variant: 'aa',
              timeCodes: ['a'],
            },
            {
              game: 'addition-substraction-within-decade',
              variant: 'ab',
              timeCodes: ['a'],
            },
            {
              game: 'addition-substraction-within-decade',
              variant: 'ac',
              timeCodes: ['a'],
            },
            {
              game: 'addition-substraction-within-decade',
              variant: 'ba',
              timeCodes: ['a'],
            },
            {
              game: 'addition-substraction-within-decade',
              variant: 'bb',
              timeCodes: ['a'],
            },
            {
              game: 'addition-substraction-within-decade',
              variant: 'bc',
              timeCodes: ['a'],
            },
            {
              game: 'sums-with-split',
              variant: 'aa',
              timeCodes: ['a'],
            },
            {
              game: 'sums-with-split',
              variant: 'ab',
              timeCodes: ['a'],
            },
            {
              game: 'sums-with-split',
              variant: 'ac',
              timeCodes: ['a'],
            },
            {
              game: 'mixed-sums',
              variant: 'ja',
              timeCodes: ['a'],
            },
            {
              game: 'mixed-sums',
              variant: 'jb',
              timeCodes: ['a'],
            },
            {
              game: 'mixed-sums',
              variant: 'jc',
              timeCodes: ['a'],
            },
            {
              game: 'mixed-sums',
              variant: 'jd',
              timeCodes: ['a'],
            },
            {
              game: 'balloon-game',
              variant: 'ak',
              timeCodes: ['a'],
            },
            {
              game: 'mixed-sums',
              variant: 'ck',
              timeCodes: ['a'],
            },
          ],
        },
      ],
    };
  }

  iconFunctions: Record<Game, RenderGameIconFunction> = {
    'addition-substraction-within-decade':
      renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
    'mixed-sums': renderMixedSumsGameHourglassGameIcon,
    'split-game': renderSplitBalloonGameHourglassGameIcon,
    'balloon-game': renderMultiplicationTablesBalloonHourglassGameIcon,
    'sums-with-split': renderSumsWithSplitGameHourglassGameIcon,
  };
}
