import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './DieFaceGameHourglassGameIcon';

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
  defaultPage: [{ title: 'Dobbelsteen spel', rows: ['aa'] }],
};

const durations = ['a', 'b'];

@customElement('die-face-game-index-app-v2')
export class DieFaceGameIndexApp extends LitElement {
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
        die-face-game-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <die-face-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></die-face-game-hourglass-game-icon>
      <die-face-game-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></die-face-game-hourglass-game-icon>
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
