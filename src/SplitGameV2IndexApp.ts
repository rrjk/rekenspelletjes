import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color } from './Colors';

import './IconHourglassButton';
import './NumberedBalloon';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  splits: string[];
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Eén cijfer splitsen',
    rows: [
      {
        description: 'Splitsingen van 3',
        shortCodes: ['sl', 'sm'],
        color: 'lavender',
        splits: ['3'],
      },
      {
        description: 'Splitsingen van 4',
        shortCodes: ['br', 'bs'],
        color: 'red',
        splits: ['4'],
      },
      {
        description: 'Splitsingen van 5',
        shortCodes: ['bt', 'bu'],
        color: 'orange',
        splits: ['5'],
      },
      {
        description: 'Splitsingen van 6',
        shortCodes: ['bv', 'bw'],
        color: 'yellow',
        splits: ['6'],
      },
      {
        description: 'Splitsingen van 7',
        shortCodes: ['bx', 'by'],
        color: 'lime',
        splits: ['7'],
      },
      {
        description: 'Splitsingen van 8',
        shortCodes: ['bz', 'ca'],
        color: 'green',
        splits: ['8'],
      },
      {
        description: 'Splitsingen van 9',
        shortCodes: ['cb', 'cc'],
        color: 'mint',
        splits: ['9'],
      },
      {
        description: 'Splitsingen van 10',
        shortCodes: ['cd', 'ce'],
        color: 'cyan',
        splits: ['10'],
      },
    ],
  },
  {
    title: 'Meerdere cijfers splitsen',
    rows: [
      {
        description: 'Splitsingen van 1 t/m 5 en 10',
        shortCodes: ['cf', 'cg'],
        color: 'navy',
        splits: ['1 2 3', '4 5 10'],
      },
      {
        description: 'Splitsingen van 6 t/m 10',
        shortCodes: ['ch', 'ci'],
        color: 'blue',
        splits: ['6 7', '8 9 10'],
      },
      {
        description: 'Splitsingen van 6 t/m 10',
        shortCodes: ['cj', 'ck'],
        color: 'purple',
        splits: ['1 2 3', '4 5 6 7', '8 9 10'],
      },
    ],
  },
];

@customElement('split-game-v2-index-app')
export class SplitGameV2IndexApp extends LitElement {
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
          width: 70px;
          height: 90px;
          border-radius: 10px;
        }
        numbered-balloon {
          width: 65px;
          height: 90px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    splits: string[],
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    const stringsToShow = [...splits, '/ \\'];
    let fontSizeFactor = 1;
    if (splits.length === 1) fontSizeFactor = 0.55;
    else if (splits.length === 2) fontSizeFactor = 0.4;
    else if (splits.length === 3) fontSizeFactor = 0.3;

    return html`
      <icon-hourglass-button
        title=${description}
        time=${duration}
        shortCode=${shortCode}
      >
        <div class="button">
          <numbered-balloon
            .color=${color}
            .stringsToShow=${stringsToShow}
            .fontSizeFactor=${fontSizeFactor}
            ropeLength="short">
          </numbered-balloon>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    splits: string[],
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        splits,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        splits,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [html`<h2>Splitsen</h2>`];
    for (const section of sections) {
      renderItems.push(html`<h3>${section.title}</h3>`);
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.splits,
              row.color,
              row.description,
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
