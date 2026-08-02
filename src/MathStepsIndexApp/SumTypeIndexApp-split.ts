import { customElement } from 'lit/decorators.js';

import { SumTypeIndexApp, IndexPageType } from './sumTypeIndexApp';

import { renderSplitBalloonGameHourglassGameIcon } from '../SplitBalloonGame/SplitBalloonGameHourglassGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = ['split-balloon'] as const;

export type Game = (typeof game)[number];

@customElement('sumtype-index-app-split')
export class SumTypeIndexAppSplit extends SumTypeIndexApp<Game> {
  get pageTitle(): string {
    return `Splitsen van getallen tot en met 10`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [
        {
          title: 'Antwoord aanklikken - één cijfer',
          rows: [
            {
              game: 'split-balloon',
              variant: 'aa',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'ab',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'ac',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'ad',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'ae',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'af',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'ag',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'ah',
              timeCodes: ['a', 'b'],
            },
          ],
        },
        {
          title: 'Antwoord aanklikken - meerdere cijfers door elkaar',
          rows: [
            {
              game: 'split-balloon',
              variant: 'ba',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'bb',
              timeCodes: ['a', 'b'],
            },
            {
              game: 'split-balloon',
              variant: 'bc',
              timeCodes: ['a', 'b'],
            },
          ],
        },
      ],
    };
  }

  iconFunctions: Record<Game, RenderGameIconFunction> = {
    'split-balloon': renderSplitBalloonGameHourglassGameIcon,
  };
}
