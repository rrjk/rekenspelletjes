import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './SplitBalloonGameHourglassGameIcon';
import { TimeCode } from '../TimeCodes';

type IndexPage = 'defaultPage';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'defaultPage':
      return value;
    default:
      return 'defaultPage';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  defaultPage: SectionInfoType[];
}

const sections: IndexPageType = {
  defaultPage: [
    {
      title: 'Eén cijfer splitsen',
      rows: ['aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah'],
    },
    {
      title: 'Meerdere cijfers splitsen',
      rows: ['ba', 'bb', 'bc'],
    },
  ],
};

// Durations to provide in the index page.
const durations: TimeCode[] = ['a', 'b'];

@customElement('split-balloon-game-index-app-v2')
export class SplitBalloonGameIndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'defaultPage';

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
        split-balloon-game-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <split-balloon-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></split-balloon-game-hourglass-game-icon>
      <split-balloon-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></split-balloon-game-hourglass-game-icon>
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
