import { html, css, LitElement } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './MultiplicationTablesBalloonHourglassGameIcon';

type Game =
  | 'balloonMultiplicationGame'
  | 'rocketMultiplicationGame'
  | 'zeppelinMultiplicationGame'
  | 'flyingSaucerMultiplicationGame';

/**
 * Convert a string into an Game.
 * In case an illegal string is provided, which does not resolve to a game
 * balloonMultiplicationGame is returned.
 *
 * @param value string to convert
 * @returns string converted to an Operator
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

const durations = ['a', 'b'];

@customElement('balloon-multiplication-game-index-app-v2')
export class BalloonMultiplicationGameIndexApp extends LitElement {
  @property({ converter: convertGame })
  accessor game: Game = 'balloonMultiplicationGame';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }
        .buttonTable {
          position: relative;
          display: flex;
          row-gap: 10px;
          flex-wrap: wrap;
          justify-content: space-around;
          width: min(400px, 90vw);
        }
        multiplication-tables-balloon-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <multiplication-tables-balloon-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></multiplication-tables-balloon-hourglass-game-icon>
      <multiplication-tables-balloon-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></multiplication-tables-balloon-hourglass-game-icon>
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of sections[this.game]) {
      renderItems.push(html`
        <h2>${section.title}</h2>
        <div class="buttonTable">
          ${section.rows.map(row => this.renderRow(row))}
        </div>
      `);
    }
    renderItems.push(
      html` <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>`,
    );
    return renderItems;
  }
}
