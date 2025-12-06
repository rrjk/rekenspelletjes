import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color } from './Colors';

import './IconHourglassButton';
import './NumberedBalloon';

type TableSet = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'firstHalf' | 'all';

interface RowInfoType {
  table: TableSet;
  shortCodes: string[];
  color: Color;
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Balonnenspel: tafeltjes oefenen',
    rows: [
      {
        table: 10,
        shortCodes: ['if', 'ig'],
        color: 'maroon',
      },
      {
        table: 2,
        shortCodes: ['ih', 'ii'],
        color: 'red',
      },
      {
        table: 5,
        shortCodes: ['ij', 'ik'],
        color: 'orange',
      },
      {
        table: 3,
        shortCodes: ['il', 'im'],
        color: 'olive',
      },
      {
        table: 4,
        shortCodes: ['in', 'io'],
        color: 'yellow',
      },
      {
        table: 'firstHalf',
        shortCodes: ['ip', 'iq'],
        color: 'lime',
      },
      {
        table: 6,
        shortCodes: ['ir', 'is'],
        color: 'green',
      },
      {
        table: 7,
        shortCodes: ['it', 'iu'],
        color: 'mint',
      },
      {
        table: 8,
        shortCodes: ['iv', 'iw'],
        color: 'cyan',
      },
      {
        table: 9,
        shortCodes: ['ix', 'iy'],
        color: 'blue',
      },
      {
        table: 'all',
        shortCodes: ['iz', 'ja'],
        color: 'purple',
      },
    ],
  },
];

@customElement('balloon-multiplication-game-index-app')
export class BalloonMultiplicationGameIndexApp extends LitElement {
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
    tableSet: TableSet,
    color: Color,
  ): HTMLTemplateResult {
    let stringsToShow: string[] = [];
    let description = '';
    let fontSizeFactor = 1;
    if (tableSet === 'firstHalf') {
      stringsToShow = [`×`, '2 3 4', '5 10'];
      description = 'Tafels van 2, 3, 4, 5 en 10';
      fontSizeFactor = 0.45;
    } else if (tableSet === 'all') {
      stringsToShow = [`×`, '2 3 4 5', '6 7 8', '9 10'];
      description = 'Tafels van 2 tot en met 10';
      fontSizeFactor = 0.35;
    } else if (tableSet >= 2 && tableSet <= 10) {
      stringsToShow = [`×${tableSet}`];
      description = `Tafel van ${tableSet}`;
      if (tableSet === 10) fontSizeFactor = 0.7;
      else fontSizeFactor = 0.8;
    } else {
      throw RangeError(
        `Internal SW error, tableSet value ${tableSet} should not be possible`,
      );
    }

    return html`
      <icon-hourglass-button
        .title=${description}
        .time=${duration}
        .shortCode=${shortCode}
      >
      <numbered-balloon
          .color=${color}
          .stringsToShow=${stringsToShow}
          ropeLength="short"
          .fontSizeFactor=${fontSizeFactor}
        ></numbered-balloon>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    tables: TableSet,
    color: Color,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(durations[0], shortCodes[0], tables, color)}
      ${this.renderButton(durations[1], shortCodes[1], tables, color)}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of sections) {
      renderItems.push(html`
        <h2>${section.title}</h2>
        <div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.table,
              row.color,
            ),
          )}
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
