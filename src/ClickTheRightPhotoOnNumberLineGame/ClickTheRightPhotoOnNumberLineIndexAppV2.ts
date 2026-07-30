import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './ClickTheRightPhotoOnNumberLineHourglassGameIcon';

type IndexPage = 'defaultPage';

function convertIndexPage(value: string | null): IndexPage {
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
      title: 'Getallenlijn van 0 tot 10',
      rows: ['ea', 'eb', 'ec'],
    },
    {
      title: 'Getallenlijn van 0 tot 20',
      rows: ['aa', 'ab', 'ac', 'ad'],
    },
    {
      title: 'Getallenlijn van 0 tot 30',
      rows: ['ba', 'bb', 'bc', 'bd'],
    },
    {
      title: 'Getallenlijn van 0 tot 50',
      rows: ['ca', 'cb', 'cc', 'cd'],
    },
    {
      title: 'Getallenlijn van 0 tot 100',
      rows: ['da', 'db', 'dc', 'dd'],
    },
  ],
};

const durations = ['a', 'b'];

@customElement('click-the-right-photo-on-number-line-index-app-v2')
export class ClickTheRightPhotoOnNumberLineIndexAppV2 extends LitElement {
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
          gap: 10px 10px;
          flex-wrap: wrap;
          width: min(400px, 92vw);
        }

        click-the-right-photo-on-number-line-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <click-the-right-photo-on-number-line-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></click-the-right-photo-on-number-line-hourglass-game-icon>
      <click-the-right-photo-on-number-line-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></click-the-right-photo-on-number-line-hourglass-game-icon>
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
      html`<p><a href="index.html">Terug naar het hoofdmenu</a></p>`,
    );
    return renderItems;
  }
}
