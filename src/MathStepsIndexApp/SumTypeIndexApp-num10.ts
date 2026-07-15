import { customElement } from 'lit/decorators.js';

import { SumTypeIndexApp, IndexPageType } from './sumTypeIndexApp';

import { RenderGameIconFunction } from '../RenderGameIconFunction';
import { renderDieFaceGameHourglassGameIcon } from '../DieFaceGame/DieFaceGameHourglassGameIcon';
import { renderHowManyFingersGameHourglassGameIcon } from '../HowManyFingersGame/HowManyFingersHourglassGameIcon';
import { renderDotCountingGameHourglassGameIcon } from '../DotCountingGame/DotCountingGameHourglassGameIcon';
import { renderSortingGameHourglassGameIcon } from '../SortingGame/SortingGameHourglassGameIcon';
import { renderClickInOrderGameHourglassGameIcon } from '../ClickInOrderGame/ClickInOrderHourglassGameIcon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = [
  'die-face-game',
  'how-many-fingers-game',
  'dot-counting-game',
  'sorting-game',
  'click-in-order-game',
] as const;

export type Game = (typeof game)[number];

@customElement('sumtype-index-app-7m5')
export class SumTypeIndexApp7m5 extends SumTypeIndexApp<Game> {
  get pageTitle(): string {
    return `Getalbegrip tot 10`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [
        {
          title: 'Begrip',
          rows: [
            {
              game: 'die-face-game',
              variant: 'aa',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'how-many-fingers-game',
              variant: 'aa',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'how-many-fingers-game',
              variant: 'ab',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'dot-counting-game',
              variant: 'ab',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'dot-counting-game',
              variant: 'aa',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'sorting-game',
              variant: 'aa',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'sorting-game',
              variant: 'ab',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'sorting-game',
              variant: 'ac',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'click-in-order-game',
              variant: 'aa',
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
  };
}
