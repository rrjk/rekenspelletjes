import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './SortingGameHourglassGameIcon';

type IndexPage = 'basicSorting' | 'largeNumbers' | 'decimalNumbers';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'basicSorting':
      return value;
    case 'largeNumbers':
      return value;
    case 'decimalNumbers':
      return value;
    default:
      return 'basicSorting';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}
interface IndexPageType {
  basicSorting: SectionInfoType[];
  largeNumbers: SectionInfoType[];
  decimalNumbers: SectionInfoType[];
}

const sections: IndexPageType = {
  basicSorting: [
    {
      title: 'Zet de getallen 1 - 10 in de goede volgorde',
      rows: ['aa', 'ab', 'ac'],
    },
    {
      title: 'Zet de getallen 1 - 30 in de goede volgorde',
      rows: ['ba', 'bb', 'bc'],
    },
    {
      title: 'Zet de getallen 1 - 50 in de goede volgorde',
      rows: ['ca', 'cb', 'cc'],
    },
    {
      title: 'Zet de getallen 1 - 100 in de goede volgorde',
      rows: ['da', 'db', 'dc'],
    },
  ],
  largeNumbers: [
    {
      title: 'Zet getallen tot 1000 of 10000 in de goede volgorde',
      rows: ['ea', 'eb'],
    },
  ],
  decimalNumbers: [
    {
      title: 'Zet de kommagetallen in de juiste volgorde',
      rows: ['fa', 'fb', 'fc'],
    },
  ],
};

const durations = ['a', 'b'];

@customElement('sorting-game-index-app-v2')
export class SortingGameIndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'basicSorting';

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
        sorting-game-hourglass-game-icon {
          width: 47%;
        }
        h3 {
          color: #666;
          font-style: italic;
          text-align: center;
          margin: 10px 0;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <sorting-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></sorting-game-hourglass-game-icon>
      <sorting-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></sorting-game-hourglass-game-icon>
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
      html` <p><a href="index.html">Terug naar het hoofdmenu</a></p>`,
    );
    return renderItems;
  }
}
