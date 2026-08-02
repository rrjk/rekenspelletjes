import { customElement } from 'lit/decorators.js';

import { SumTypeIndexApp, IndexPageType } from './sumTypeIndexApp';

import { RenderGameIconFunction } from '../RenderGameIconFunction';
import { renderDieFaceGameHourglassGameIcon } from '../DieFaceGame/DieFaceGameHourglassGameIcon';
import { renderHowManyFingersGameHourglassGameIcon } from '../HowManyFingersGame/HowManyFingersHourglassGameIcon';
import { renderDotCountingGameHourglassGameIcon } from '../DotCountingGame/DotCountingGameHourglassGameIcon';
import { renderSortingGameHourglassGameIcon } from '../SortingGame/SortingGameHourglassGameIcon';
import { renderClickInOrderGameHourglassGameIcon } from '../ClickInOrderGame/ClickInOrderHourglassGameIcon';
import { renderClickTheRightPhotoOnNumberLineHourglassGameIcon } from '../ClickTheRightPhotoOnNumberLineGame/ClickTheRightPhotoOnNumberLineHourglassGameIcon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = [
  'die-face-game',
  'how-many-fingers-game',
  'dot-counting-game',
  'sorting-game',
  'click-in-order-game',
  'click-the-right-photo-on-number-line-game',
] as const;

export type Game = (typeof game)[number];

@customElement('sumtype-index-app-num20')
export class SumTypeIndexAppNum20 extends SumTypeIndexApp<Game> {
  get pageTitle(): string {
    return `Getalbegrip tot 20`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [
        {
          title: 'Begrip',
          rows: [
            {
              game: 'sorting-game',
              variant: 'ga',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'sorting-game',
              variant: 'gb',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'sorting-game',
              variant: 'gc',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'click-the-right-photo-on-number-line-game',
              variant: 'aa',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'click-the-right-photo-on-number-line-game',
              variant: 'ab',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'click-the-right-photo-on-number-line-game',
              variant: 'ac',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'click-the-right-photo-on-number-line-game',
              variant: 'ad',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'click-in-order-game',
              variant: 'ab',
              timeCodes: [],
            },
            {
              game: 'click-in-order-game',
              variant: 'ac',
              timeCodes: [],
            },
          ],
        },
      ],
    };
  }

  iconFunctions: Record<Game, RenderGameIconFunction> = {
    'die-face-game': renderDieFaceGameHourglassGameIcon,
    'how-many-fingers-game': renderHowManyFingersGameHourglassGameIcon,
    'dot-counting-game': renderDotCountingGameHourglassGameIcon,
    'sorting-game': renderSortingGameHourglassGameIcon,
    'click-in-order-game': renderClickInOrderGameHourglassGameIcon,
    'click-the-right-photo-on-number-line-game':
      renderClickTheRightPhotoOnNumberLineHourglassGameIcon,
  };
}
