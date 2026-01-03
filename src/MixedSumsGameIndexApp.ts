import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color } from './Colors';

import './IconMixedSums';
import './IconHourglassButton';
import { Operator } from './Operator';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  operators: Operator[];
  maxAnswer: number;
  maxTable: number;
  puzzle: boolean;
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Gemengde sommen',
    rows: [
      {
        description: 'Gemengde plus- en minsommen tot 10',
        shortCodes: ['sr', 'ss'],
        color: 'lavender',
        operators: ['plus', 'minus'],
        maxAnswer: 10,
        maxTable: 10,
        puzzle: false,
      },
      {
        description: 'Gemengde plus- en minsommen tot 100',
        shortCodes: ['st', 'su'],
        color: 'red',
        operators: ['plus', 'minus'],
        maxAnswer: 100,
        maxTable: 10,
        puzzle: false,
      },
      {
        description: 'Gemengde plus- en minsommen tot 1000',
        shortCodes: ['sv', 'sw'],
        color: 'orange',
        operators: ['plus', 'minus'],
        maxAnswer: 1000,
        maxTable: 10,
        puzzle: false,
      },
      {
        description:
          'Gemengde keer- en gedeeld door sommen met de tafels tot 10',
        shortCodes: ['sx', 'sy'],
        color: 'yellow',
        operators: ['times', 'divide'],
        maxAnswer: 1000,
        maxTable: 10,
        puzzle: false,
      },
      {
        description:
          'Gemengde keer- en gedeeld door sommen met de tafels tot 20',
        shortCodes: ['sz', 'ta'],
        color: 'lime',
        operators: ['times', 'divide'],
        maxAnswer: 1000,
        maxTable: 20,
        puzzle: false,
      },
      {
        description:
          'Gemengde plus, min, keer- en gedeeld door sommen tot 100 met de tafels tot 10',
        shortCodes: ['tb', 'tc'],
        color: 'green',
        operators: ['plus', 'minus', 'times', 'divide'],
        maxAnswer: 100,
        maxTable: 10,
        puzzle: false,
      },
      {
        description:
          'Gemengde plus, min, keer- en gedeeld door sommen tot 1000 met de tafels tot 10',
        shortCodes: ['td', 'te'],
        color: 'mint',
        operators: ['plus', 'minus', 'times', 'divide'],
        maxAnswer: 1000,
        maxTable: 10,
        puzzle: false,
      },
      {
        description:
          'Gemengde plus, min, keer- en gedeeld door sommen tot 1000 met de tafels tot 20',
        shortCodes: ['tf', 'tg'],
        color: 'cyan',
        operators: ['plus', 'minus', 'times', 'divide'],
        maxAnswer: 1000,
        maxTable: 20,
        puzzle: false,
      },
    ],
  },
  {
    title: 'Gemengde sommen met puzzel',
    rows: [
      {
        description: 'Gemengde plus- en minsommen tot 100',
        shortCodes: ['th', 'ti'],
        color: 'lavender',
        operators: ['plus', 'minus'],
        maxAnswer: 10,
        maxTable: 10,
        puzzle: true,
      },
      {
        description: 'Gemengde plus- en minsommen tot 100',
        shortCodes: ['tj', 'tk'],
        color: 'red',
        operators: ['plus', 'minus'],
        maxAnswer: 100,
        maxTable: 10,
        puzzle: true,
      },
      {
        description: 'Gemengde plus- en minsommen tot 1000',
        shortCodes: ['tl', 'tm'],
        color: 'orange',
        operators: ['plus', 'minus'],
        maxAnswer: 1000,
        maxTable: 10,
        puzzle: true,
      },
      {
        description:
          'Gemengde keer- en gedeeld door sommen met de tafels tot 10',
        shortCodes: ['tn', 'to'],
        color: 'yellow',
        operators: ['times', 'divide'],
        maxAnswer: 1000,
        maxTable: 10,
        puzzle: true,
      },
      {
        description:
          'Gemengde keer- en gedeeld door sommen met de tafels tot 20',
        shortCodes: ['tp', 'tq'],
        color: 'lime',
        operators: ['times', 'divide'],
        maxAnswer: 1000,
        maxTable: 20,
        puzzle: true,
      },
      {
        description:
          'Gemengde plus, min, keer- en gedeeld door sommen tot 100 met de tafels tot 10',
        shortCodes: ['tr', 'ts'],
        color: 'green',
        operators: ['plus', 'minus', 'times', 'divide'],
        maxAnswer: 100,
        maxTable: 10,
        puzzle: true,
      },
      {
        description:
          'Gemengde plus, min, keer- en gedeeld door sommen tot 1000 met de tafels tot 10',
        shortCodes: ['tt', 'tu'],
        color: 'mint',
        operators: ['plus', 'minus', 'times', 'divide'],
        maxAnswer: 1000,
        maxTable: 20,
        puzzle: true,
      },
      {
        description:
          'Gemengde plus, min, keer- en gedeeld door sommen tot 1000 met de tafels tot 20',
        shortCodes: ['tv', 'tw'],
        color: 'cyan',
        operators: ['plus', 'minus', 'times', 'divide'],
        maxAnswer: 1000,
        maxTable: 20,
        puzzle: true,
      },
    ],
  },
];

@customElement('mixed-sums-game-index-app')
export class MixedSumsGameIndexApp extends LitElement {
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
          display: grid;
          grid-template-columns: 100%;
          justify-items: center;
          width: 100px;
          height: 90px;
          border-radius: 10px;
        }
        icon-mixed-sums {
          width: 90px;
          height: 90px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    operators: Operator[],
    maxAnswer: number,
    maxTable: number,
    color: Color,
    description: string,
    puzzle: boolean,
  ): HTMLTemplateResult {
    const plus = operators.includes('plus');
    const minus = operators.includes('minus');
    const times = operators.includes('times');
    const divide = operators.includes('divide');

    return html`
      <icon-hourglass-button
        title=${description}
        time=${duration}
        shortCode=${shortCode}
      >
        <div class="button">
          <icon-mixed-sums
            .color=${color}
            ?plus=${plus}
            ?minus=${minus}
            ?times=${times}
            ?divide=${divide}
            ?puzzlePiece=${puzzle}
            maxAnswer=${maxAnswer}
            maxTable=${maxTable}>
          </icon-mixed-sums>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    operators: Operator[],
    maxAnswer: number,
    maxTable: number,
    color: Color,
    description: string,
    puzzle: boolean,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        operators,
        maxAnswer,
        maxTable,
        color,
        description,
        puzzle,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        operators,
        maxAnswer,
        maxTable,
        color,
        description,
        puzzle,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [html`<h2>Gemengde sommen</h2>`];
    for (const section of sections) {
      renderItems.push(html`<h3>${section.title}</h3>`);
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.operators,
              row.maxAnswer,
              row.maxTable,
              row.color,
              row.description,
              row.puzzle,
            ),
          )}
        </div> `,
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
