import { html, css, LitElement } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color } from './Colors';

import './IconHourglassButton';
import './FlyingSaucer';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  text: string;
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title:
      'Vliegende schotel spel: delen en vermenigvuldigen met de tafels boven de 10',
    rows: [
      {
        description: 'Tafel van 11',
        shortCodes: ['ql', 'qm'],
        color: 'red',
        text: '11',
      },
      {
        description: 'Tafel van 12',
        shortCodes: ['qn', 'qo'],
        color: 'orange',
        text: '12',
      },
      {
        description: 'Tafel van 13',
        shortCodes: ['qp', 'qq'],
        color: 'yellow',
        text: '13',
      },
      {
        description: 'Tafel van 14',
        shortCodes: ['qr', 'qs'],
        color: 'lime',
        text: '14',
      },
      {
        description: 'Tafels van 11 tot en met 14 door elkaar',
        shortCodes: ['qt', 'qu'],
        color: 'brown',
        text: '11-14',
      },
      {
        description: 'Tafel van 15',
        shortCodes: ['qv', 'qw'],
        color: 'green',
        text: '15',
      },
      {
        description: 'Tafel van 16',
        shortCodes: ['qx', 'qy'],
        color: 'cyan',
        text: '16',
      },
      {
        description: 'Tafel van 17',
        shortCodes: ['qz', 'ra'],
        color: 'blue',
        text: '17',
      },
      {
        description: 'Tafel van 18',
        shortCodes: ['rb', 'rc'],
        color: 'purple',
        text: '18',
      },
      {
        description: 'Tafel van 19',
        shortCodes: ['rd', 're'],
        color: 'magenta',
        text: '19',
      },
      {
        description: 'Tafel van 11 tot en met 19 door elkaar',
        shortCodes: ['rf', 'rg'],
        color: 'pink',
        text: '11-19',
      },
    ],
  },
];

@customElement('flying-saucer-game-index-app')
export class FlyingSaucerGameIndexApp extends LitElement {
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
          width: 410px;
        }
        div.button {
          width: 100px;
          height: 90px;
          border-radius: 10px;
        }
        flying-saucer {
          width: 90px;
          height: 70px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    text: string,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      <icon-hourglass-button
        title="${description}"
        time="${duration}"
        shortCode="${shortCode}"
      >
      <flying-saucer
          color=${color}
          content=${text}
        ></gamflying-saucer>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    text: string,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        text,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        text,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>
        Vliegende schotel spel: delen en vermenigvuldigen met de tafels boven de
        10
      </h2>`,
    ];
    for (const section of sections) {
      renderItems.push(
        html`<div class="buttonTable">
            ${section.rows.map(row =>
              this.renderRow(
                ['1min', '3min'],
                row.shortCodes,
                row.text,
                row.color,
                row.description,
              ),
            )}
          </div>
          <p>
            <a href="index.html">Terug naar het hoofdmenu</a>
          </p>`,
      );
    }
    return renderItems;
  }
}
