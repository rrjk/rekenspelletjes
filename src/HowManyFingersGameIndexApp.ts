import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './IconHourglassButton';
import './HandFace';
import { PossibleNumberFingers } from './HowManyFingersGameAppLink';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  nmbrToShow: PossibleNumberFingers;
}

interface SectionInfoType {
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    rows: [
      {
        description: 'Hoeveel vingers op één hand spel',
        shortCodes: ['sn', 'so'],
        nmbrToShow: 4,
      },
      {
        description: 'Hoeveel vingers op één of twee handen spel',
        shortCodes: ['sp', 'sq'],
        nmbrToShow: 7,
      },
    ],
  },
];

@customElement('how-many-fingers-game-index-app')
export class HowManyFingersGameIndexApp extends LitElement {
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

        hand-face {
          width: 90px;
          height: 90px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    nmbrFingers: PossibleNumberFingers,
    description: string,
  ): HTMLTemplateResult {
    return html`
      <icon-hourglass-button
        title=${description}
        time=${duration}
        shortCode=${shortCode}
      >
        <div class="button">
          <hand-face  .nmbrToShow=${nmbrFingers}></hand-face>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    nmbrFingers: PossibleNumberFingers,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        nmbrFingers,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        nmbrFingers,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Hoeveel vingers spelletjes</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.nmbrToShow,
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
