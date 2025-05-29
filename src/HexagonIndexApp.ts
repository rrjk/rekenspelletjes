import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color } from './Colors';

import './IconHourglassButton';
import './GameIconWithTextOverlay';
import { Operator } from './SquaresBalloonGameLink';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  operators: Operator[];
  maxBase: number;
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Kwadraten',
    rows: [
      {
        description: 'Kwadraten tot en met de tien',
        shortCodes: ['pt', 'pu'],
        color: 'red',
        operators: ['square'],
        maxBase: 10,
      },
      {
        description: 'Kwadraten tot en met de vijftien',
        shortCodes: ['pv', 'pw'],
        color: 'orange',
        operators: ['square'],
        maxBase: 15,
      },
      {
        description: 'Kwadraten tot en met de twintig',
        shortCodes: ['px', 'py'],
        color: 'yellow',
        operators: ['square'],
        maxBase: 20,
      },
    ],
  },

  {
    title: 'Worteltrekken',
    rows: [
      {
        description: 'Worteltrekken met antwoorden tot en met de tien',
        shortCodes: ['pz', 'qa'],
        color: 'lime',
        operators: ['root'],
        maxBase: 10,
      },
      {
        description: 'Worteltrekken met antwoorden tot en met de vijftien',
        shortCodes: ['qb', 'qc'],
        color: 'green',
        operators: ['root'],
        maxBase: 15,
      },
      {
        description: 'Worteltrekken met antwoorden tot en met de twintig',
        shortCodes: ['qd', 'qe'],
        color: 'mint',
        operators: ['root'],
        maxBase: 20,
      },
    ],
  },

  {
    title: 'Kwadraten en worteltrekken door elkaar',
    rows: [
      {
        description: 'Kwadraten en wortels tot en met de tien',
        shortCodes: ['qf', 'qg'],
        color: 'blue',
        operators: ['square', 'root'],
        maxBase: 10,
      },
      {
        description: 'Kwadraten en wortels tot en met de vijftien',
        shortCodes: ['qh', 'qi'],
        color: 'purple',
        operators: ['square', 'root'],
        maxBase: 15,
      },
      {
        description: 'Kwadraten en wortels tot en met de twintig',
        shortCodes: ['qj', 'qk'],
        color: 'magenta',
        operators: ['square', 'root'],
        maxBase: 20,
      },
    ],
  },
];

@customElement('hexagon-game-index-app')
export class FractionsPairMatchingGameIndexApp extends LitElement {
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
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    operators: Operator[],
    maxBase: number,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    let text1 = '';
    let text2 = '';
    if (operators.length === 1 && operators[0] === 'square')
      text1 = `${maxBase}²`;
    else if (operators.length === 1 && operators[0] === 'root')
      text1 = `√${maxBase}`;
    else if (operators.length === 2) {
      text1 = `${maxBase}²`;
      text2 = `√${maxBase}`;
    }

    return html`
      <icon-hourglass-button
        title="${description}"
        time="${duration}"
        shortCode="${shortCode}"
      >
        <game-icon-with-text-overlay
          iconcolor=${color}
          image="hexagon"
          text1="${text1}"
          text2="${text2}"
        ></game-icon-with-text-overlay>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    operators: Operator[],
    maxBase: number,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        operators,
        maxBase,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        operators,
        maxBase,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Oefenen met kwadraten en wortels</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(html`<h3>${section.title}</h3>`);
      renderItems.push(
        html`<div class="buttonTable">
            ${section.rows.map(row =>
              this.renderRow(
                ['1min', '3min'],
                row.shortCodes,
                row.operators,
                row.maxBase,
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
