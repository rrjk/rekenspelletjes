import { customElement } from 'lit/decorators.js';

import { operatorToSymbol } from '../Operator';

import { SumTypeIndexApp, IndexPageType } from './sumTypeIndexApp';

import { renderNumberlineArchesGameHourglassGameIcon } from '../NumberlineArchesGame/NumberlineArchesGameHourglassGameIcon';
import { renderMixedSumsGameHourglassGameIcon } from '../MixedSumsGame/MixedSumsHourglassGameIcon';
import { renderAdditionSubstractionWithinDecadeGameHourglassGameIcon } from '../AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameHourglassGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = [
  'numberline-arches',
  'addition-substraction-within-decade',
  'mixed-sums',
] as const;

export type Game = (typeof game)[number];

@customElement('sumtype-index-app-17m5')
export class SumTypeIndexApp17m5 extends SumTypeIndexApp<Game> {
  get pageTitle(): string {
    return `Sommen als 17 ${operatorToSymbol('minus')} 5`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [
        {
          title: 'Begrip',
          rows: [
            {
              game: 'numberline-arches',
              variant: 'bb',
              timeCodes: ['a', 'b'],
            },
          ],
        },
        {
          title: 'Antwoord aanklikken',
          rows: [
            {
              game: 'addition-substraction-within-decade',
              variant: 'bb',
              timeCodes: ['a', 'b'],
            },
          ],
        },
        {
          title: 'Antwoord typen',
          rows: [
            {
              game: 'mixed-sums',
              variant: 'ie',
              timeCodes: ['a', 'b'],
            },
          ],
        },
      ],
    };
  }

  iconFunctions: Record<Game, RenderGameIconFunction> = {
    'numberline-arches': renderNumberlineArchesGameHourglassGameIcon,
    'addition-substraction-within-decade':
      renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
    'mixed-sums': renderMixedSumsGameHourglassGameIcon,
  };
}
