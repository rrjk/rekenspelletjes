import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './ClickInOrderHourglassGameIcon';

type IndexPage =
  | 'aanklikkenInVolgorde'
  | 'ballenKnallen'
  | 'ballenKnallenMetSom';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'aanklikkenInVolgorde':
    case 'ballenKnallen':
    case 'ballenKnallenMetSom':
      return value;
    default:
      return 'aanklikkenInVolgorde';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  aanklikkenInVolgorde: SectionInfoType[];
  ballenKnallen: SectionInfoType[];
  ballenKnallenMetSom: SectionInfoType[];
}

const sections: IndexPageType = {
  aanklikkenInVolgorde: [
    {
      title: '',
      rows: ['aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ba', 'bb', 'bc'],
    },
  ],
  ballenKnallen: [
    {
      title: '',
      rows: ['ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'cg', 'ch', 'ci'],
    },
  ],
  ballenKnallenMetSom: [
    {
      title: '',
      rows: ['da', 'db', 'dc', 'dd', 'de', 'df', 'dg', 'dh', 'di', 'dj', 'dk'],
    },
  ],
};

@customElement('click-in-order-game-index-app-v2')
export class ClickInOrderGameIndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'aanklikkenInVolgorde';

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
          width: min(200px, 50vw);
        }
        click-in-order-hourglass-game-icon {
          width: 100%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <click-in-order-hourglass-game-icon
        variant=${variant}
      ></click-in-order-hourglass-game-icon>
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of sections[this.indexPage]) {
      renderItems.push(html`
        ${section.title !== '' ? html`<h2>${section.title}</h2>` : ''}
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
