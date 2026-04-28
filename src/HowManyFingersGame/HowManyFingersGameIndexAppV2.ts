import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './HowManyFingersHourglassGameIcon';

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
      title: 'Hoeveel vingers spelletjes',
      rows: ['aa', 'ab'],
    },
  ],
};

const durations = ['a', 'b'];

@customElement('how-many-fingers-game-index-app-v2')
export class HowManyFingersGameIndexApp extends LitElement {
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
        how-many-fingers-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <how-many-fingers-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></how-many-fingers-hourglass-game-icon>
      <how-many-fingers-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></how-many-fingers-hourglass-game-icon>
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
