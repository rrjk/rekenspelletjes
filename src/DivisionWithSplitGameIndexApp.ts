import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color, getColorInfo } from './Colors';

import './IconHourglassButton';
import './DivideWithSplitWidget';
import type { FillInInfo, FixedNumberInfo } from './DivideWithSplitWidget';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  fixedNumbers: FixedNumberInfo;
  fillInNumbers: FillInInfo;
  showHelp: boolean;
  color: Color;
}

interface SectionInfoType {
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    rows: [
      {
        description: 'Delen met splitsen, antwoorden van 11 t/m 19',
        shortCodes: ['sd', 'se'],
        fixedNumbers: { dividend: 65, divisor: 5 },
        fillInNumbers: {
          split0: 50,
          split1: 15,
          subAnswer0: 10,
          subAnswer1: 3,
          answer: 13,
        },
        showHelp: true,
        color: 'lavender',
      },
      {
        description: 'Delen met splitsen, antwoorden van 11 t/m 99',
        shortCodes: ['sf', 'sg'],
        fixedNumbers: { dividend: 175, divisor: 5 },
        fillInNumbers: {
          split0: 150,
          split1: 25,
          subAnswer0: 30,
          subAnswer1: 5,
          answer: 35,
        },
        showHelp: true,
        color: 'mint',
      },
      {
        description:
          'Delen met splitsen, antwoorden van 11 t/m 99, zonder hulp',
        shortCodes: ['sh', 'si'],
        fixedNumbers: { dividend: 504, divisor: 7 },
        fillInNumbers: {
          split0: 490,
          split1: 14,
          subAnswer0: 70,
          subAnswer1: 2,
          answer: 72,
        },
        showHelp: false,
        color: 'apricot',
      },
    ],
  },
];

@customElement('division-with-split-game-index-app')
export class DivisionWithSplitGameIndexApp extends LitElement {
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

        divide-with-split-widget {
          width: 100px;
          height: 65px;
        }

        img {
          width: 100px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    fixedNumbers: FixedNumberInfo,
    fillInNumbers: FillInInfo,
    showHelp: boolean,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      <icon-hourglass-button
        title=${description}
        time=${duration}
        shortCode=${shortCode}
      >
        <div style="background-color:${getColorInfo(color).mainColorCode}" class="button">
          <divide-with-split-widget .fixedNumbers=${fixedNumbers} .fillInNumbers=${fillInNumbers} .showSubAnswers=${showHelp} .showHelp=${showHelp} activeFillIn="answer"></divide-with-split-widget>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    fixedNumbers: FixedNumberInfo,
    fillInNumbers: FillInInfo,
    showHelp: boolean,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        fixedNumbers,
        fillInNumbers,
        showHelp,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        fixedNumbers,
        fillInNumbers,
        showHelp,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Delen met splitsen</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['3min', '5min'],
              row.shortCodes,
              row.fixedNumbers,
              row.fillInNumbers,
              row.showHelp,
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
