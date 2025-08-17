import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { type Color } from './Colors';

import './IconHourglassButton';
import './DieFace';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
}

interface SectionInfoType {
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    rows: [
      {
        description: 'Dobbelsteen spel',
        shortCodes: ['sj', 'sk'],
        color: 'purple',
      },
    ],
  },
];

@customElement('die-face-game-index-app')
export class DieFaceGameIndexApp extends LitElement {
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
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 90px;
          border-radius: 10px;
        }

        span {
          font-size: 20px;
        }

        die-face {
          width: 90px;
          height: 90px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      <icon-hourglass-button
        title=${description}
        time=${duration}
        shortCode=${shortCode}
      >
        <div class="button">
          <die-face .dieFaceColor=${color} .dieFaceNumber=5></die-face>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(durations[0], shortCodes[0], color, description)}
      ${this.renderButton(durations[1], shortCodes[1], color, description)}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Dobbelsteen spelletjes</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.color,
              row.description,
            ),
          )}
        </div>`,
      );
    }
    renderItems.push(
      html` <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>`,
    );
    return renderItems;
  }
}
