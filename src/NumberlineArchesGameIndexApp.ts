import { html, css, LitElement, nothing } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import type { ArchType } from './NumberLineV2';
import { Color, getColorInfo } from './Colors';

import './IconHourglassButton';
import './NumberLineV2';

type ArchesLocationType = 'below' | 'above';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  arches: ArchType[];
}

interface SectionInfoType {
  min: number;
  max: number;
  archLocation: ArchesLocationType;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    min: 0,
    max: 10,
    archLocation: 'below',
    rows: [
      {
        description: '- minsommen, zonder over het tiental heen te gaan',
        shortCodes: ['nv', 'nw'],
        color: 'pink',
        arches: [{ from: 9, to: 3 }],
      },
    ],
  },
  {
    min: 0,
    max: 20,
    archLocation: 'below',
    rows: [
      {
        description: '- minsommen, zonder over het tiental heen te gaan',
        shortCodes: ['nx', 'ny'],
        color: 'orange',
        arches: [{ from: 8, to: 3 }],
      },
      {
        description: '- minsommen, zonder splitsen, met boogjes van tien',
        shortCodes: ['nz', 'oa'],
        color: 'brown',
        arches: [
          { from: 16, to: 6 },
          { from: 6, to: 3 },
        ],
      },
      {
        description: '- minsommen, met splitsen, zonder boogjes van tien',
        shortCodes: ['ob', 'oc'],
        color: 'olive',
        arches: [
          { from: 16, to: 10 },
          { from: 10, to: 7 },
        ],
      },
    ],
  },
];

@customElement('numberline-arches-game-index-app')
export class NumberlineArchesGameIndexApp extends LitElement {
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
          grid-template-rows: 65px 25px;
          justify-items: center;
          width: 100px;
          height: 90px;
          border-radius: 10px;
        }

        span {
          font-size: 20px;
        }

        number-line-v2 {
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
    min: number,
    max: number,
    arches: ArchType[],
    archesLocation: ArchesLocationType,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    let belowArches: ArchType[] | typeof nothing = nothing;
    let aboveArches: ArchType[] | typeof nothing = nothing;
    if (archesLocation === 'above') aboveArches = arches;
    else if (archesLocation === 'below') belowArches = arches;

    let iconNumberLineLength = 10;
    if (max - min > 10) iconNumberLineLength = 20;
    if (max - min > 20) iconNumberLineLength = 30;
    return html`
      <icon-hourglass-button
        title="Getallenlijn boogjes spel ${min} tot ${max} ${description}"
        time="${duration}"
        shortCode="${shortCode}"
      >
        <div style="background-color:${getColorInfo(color).mainColorCode}" class="button">
          <number-line-v2
            min="0"
            max="${iconNumberLineLength}"
            tickMarks="upToSingles"
            .belowArches="${belowArches}"
            .aboveArches="${aboveArches}"
          ></number-line-v2>
          <span>${min} － ${max}</span>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    min: number,
    max: number,
    arches: ArchType[],
    archesLocation: ArchesLocationType,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        min,
        max,
        arches,
        archesLocation,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        min,
        max,
        arches,
        archesLocation,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Getallenlijn boogjes spel met minsommen</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(html`<h3>Van ${section.min} tot ${section.max}</h3>`);
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['3min', '5min'],
              row.shortCodes,
              section.min,
              section.max,
              row.arches,
              section.archLocation,
              row.color,
              row.description,
            ),
          )}
        </div>`,
      );
    }
    return renderItems;
  }
}
