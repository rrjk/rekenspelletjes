import { css } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderMultiplicationTablesBalloonHourglassGameIcon } from './MultiplicationTablesBalloonHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type Game =
  | 'balloonMultiplicationGame'
  | 'rocketMultiplicationGame'
  | 'zeppelinMultiplicationGame'
  | 'flyingSaucerMultiplicationGame';

/**
 * Converts a raw attribute value to a valid index page key.
 *
 * Invalid values fall back to the default balloon multiplication page.
 */
export function convertGame(value: string | null): Game {
  switch (value) {
    case 'balloonMultiplicationGame':
    case 'rocketMultiplicationGame':
    case 'zeppelinMultiplicationGame':
    case 'flyingSaucerMultiplicationGame':
      return value;
    default:
      return 'balloonMultiplicationGame';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface GameInfoType {
  balloonMultiplicationGame: SectionInfoType[];
  rocketMultiplicationGame: SectionInfoType[];
  zeppelinMultiplicationGame: SectionInfoType[];
  flyingSaucerMultiplicationGame: SectionInfoType[];
}

const sections: GameInfoType = {
  balloonMultiplicationGame: [
    {
      title: 'Balonnenspel: tafeltjes oefenen',
      rows: ['aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak'],
    },
  ],
  rocketMultiplicationGame: [
    {
      title: 'Raketspel: Deelsommen met de tafeltjes',
      rows: ['ba', 'bb', 'bc', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bk'],
    },
    {
      title: 'Raketspel: Deelsommen en keersommen met de tafeltjes.',
      rows: ['ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'cg', 'ch', 'ci', 'cj', 'ck'],
    },
  ],
  zeppelinMultiplicationGame: [
    {
      title: 'Zeppelinspel: Keersommen boven de 10',
      rows: [
        'fa',
        'fb',
        'fc',
        'fd',
        'fe',
        'ff',
        'fg',
        'fh',
        'fi',
        'fj',
        'fk',
        'fl',
      ],
    },
  ],
  flyingSaucerMultiplicationGame: [
    {
      title: 'Delen met de tafels boven de 10',
      rows: ['da', 'db', 'dc', 'dd', 'de', 'df', 'dg', 'dh', 'di', 'dj', 'dk'],
    },
    {
      title: 'Delen en vermenigvuldigen door elkaar, met de tafels boven de 10',
      rows: ['ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'eg', 'eh', 'ei', 'ej', 'ek'],
    },
  ],
};

/** Time codes shown for each variant as a left/right icon pair. */
const durations: TimeCode[] = ['a', 'b'];

/**
 * Variant index app for Multiplication Tables Balloon Game.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('balloon-multiplication-game-index-app-v2')
export class BalloonMultiplicationGameIndexApp extends VariantIndexAppBase<Game> {
  @property({ converter: convertGame })
  accessor game: Game = 'balloonMultiplicationGame';

  protected get selectedPage(): Game {
    return this.game;
  }

  protected get sectionsByPage(): VariantSections<Game> {
    return sections;
  }

  protected override get timeCodes(): TimeCode[] {
    return durations;
  }

  protected get iconRenderer() {
    return renderMultiplicationTablesBalloonHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        multiplication-tables-balloon-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
