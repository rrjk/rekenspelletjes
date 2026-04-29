import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './FractionsPairMatchingGameHourglassGameIcon';

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
      title: 'Sleep dezelfde breuken over elkaar heen',
      rows: ['aa', 'ab', 'ac', 'ad', 'ae', 'af'],
    },
  ],
};

const durations = ['a', 'b'];

@customElement('fractions-pair-matching-game-index-app-v2')
export class FractionsPairMatchingGameIndexApp extends LitElement {
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
        fractions-pair-matching-game-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <fractions-pair-matching-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></fractions-pair-matching-game-hourglass-game-icon>
      <fractions-pair-matching-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></fractions-pair-matching-game-hourglass-game-icon>
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
