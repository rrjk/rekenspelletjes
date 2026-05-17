import { html, css, LitElement } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './MixedSumsHourglassGameIcon';

type IndexPage = 'mixedSums'; // Having this allows in the future to add other index pages as well;

/**
 * Convert a string into an Game.
 * In case an illegal string is provided, which does not resolve to a game
 * withPuzzle is returned.
 *
 * @param value string to convert
 * @returns string converted to an Operator
 */
export function convertGame(value: string | null): IndexPage {
  switch (value) {
    case 'mixedSums':
      return value;
    default:
      return 'mixedSums';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  mixedSums: SectionInfoType[];
}

const sections: IndexPageType = {
  mixedSums: [
    {
      title: 'Gemengde sommen met puzzel',
      rows: ['aa', 'ab', 'ac', 'ai', 'aj', 'ad', 'ae', 'af', 'ag', 'ah'],
    },
    {
      title: 'Gemengde sommen zonder puzzel',
      rows: ['ba', 'bb', 'bc', 'bi', 'bj', 'bd', 'be', 'bf', 'bg', 'bh'],
    },
  ],
};

const durations = ['a', 'b'];

@customElement('mixed-sums-game-index-app-v2')
export class MixedSumsGameIndexApp extends LitElement {
  @property({ converter: convertGame })
  accessor indexPage: IndexPage = 'mixedSums';

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
        mixed-sums-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <mixed-sums-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></mixed-sums-hourglass-game-icon>
      <mixed-sums-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></mixed-sums-hourglass-game-icon>
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of sections[this.indexPage]) {
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
