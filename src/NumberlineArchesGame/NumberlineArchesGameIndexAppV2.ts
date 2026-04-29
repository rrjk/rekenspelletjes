import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './NumberlineArchesGameHourglassGameIcon';

type IndexPage = 'plusPage' | 'minusPage';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'plusPage':
      return value;
    case 'minusPage':
      return value;
    default:
      return 'plusPage';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  plusPage: SectionInfoType[];
  minusPage: SectionInfoType[];
}

const sections: IndexPageType = {
  plusPage: [
    {
      title: 'Op een getallenlijn van 0 tot 10',
      rows: ['aa'],
    },
    {
      title: 'Op een getallenlijn van 0 tot 20',
      rows: ['ab', 'ac'],
    },
  ],
  minusPage: [
    {
      title: 'Op een getallenlijn van 0 tot 10',
      rows: ['ba'],
    },
    {
      title: 'Op een getallenlijn van 0 tot 20',
      rows: ['bb', 'bc'],
    },
  ],
};

const durations = ['b', 'c'];

@customElement('numberline-arches-game-index-app-v2')
export class NumberlineArchesGameIndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'plusPage';

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
        numberline-arches-game-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <numberline-arches-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></numberline-arches-game-hourglass-game-icon>
      <numberline-arches-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></numberline-arches-game-hourglass-game-icon>
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
