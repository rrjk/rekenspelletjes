import { html, css, LitElement, nothing } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import type { ArchType } from './NumberLineV2';
import { Color, getColorInfo } from './Colors';

import './IconHourglassButton';
import './NumberLineV2';
import { OperatorType } from './NumberlineArchesGameAppLink';

type ArchesLocationType = 'below' | 'above';

interface RowInfoType {
  description: string;
  min: number;
  max: number;
  shortCodes: string[];
  color: Color;
  arches: ArchType[];
}

interface SectionInfoType {
  minNumberline: number;
  maxNumberline: number;
  archLocation: ArchesLocationType;
  rows: RowInfoType[];
}

const plusSections: SectionInfoType[] = [
  {
    minNumberline: 0,
    maxNumberline: 10,
    archLocation: 'above',
    rows: [
      {
        description: '- plussommen, zonder over het tiental heen te gaan',
        min: 0,
        max: 10,
        shortCodes: ['nf', 'ng'],
        color: 'olive',
        arches: [{ from: 3, to: 7 }],
      },
    ],
  },
  {
    minNumberline: 0,
    maxNumberline: 20,
    archLocation: 'above',
    rows: [
      {
        description: '- plussommen, zonder over het tiental heen te gaan',
        min: 10,
        max: 20,
        shortCodes: ['nj', 'nk'],
        color: 'lavender',
        arches: [{ from: 13, to: 18 }],
      },
      {
        description: '- plussommen, met splitsen, zonder boogjes van tien',
        min: 0,
        max: 20,
        shortCodes: ['nl', 'nm'],
        color: 'apricot',
        arches: [
          { from: 6, to: 10 },
          { from: 10, to: 15 },
        ],
      },
    ],
  },
];

const minusSections: SectionInfoType[] = [
  {
    minNumberline: 0,
    maxNumberline: 10,
    archLocation: 'below',
    rows: [
      {
        description: '- minsommen, zonder over het tiental heen te gaan',
        min: 0,
        max: 10,
        shortCodes: ['nv', 'nw'],
        color: 'pink',
        arches: [{ from: 9, to: 3 }],
      },
    ],
  },
  {
    minNumberline: 0,
    maxNumberline: 20,
    archLocation: 'below',
    rows: [
      {
        description: '- minsommen, zonder over het tiental heen te gaan',
        min: 10,
        max: 20,
        shortCodes: ['nz', 'ma'],
        color: 'orange',
        arches: [{ from: 18, to: 13 }],
      },
      {
        description: '- minsommen, met splitsen, zonder boogjes van tien',
        min: 0,
        max: 20,
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
  @property()
  accessor operator: OperatorType = 'plus';

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
    minNumberline: number,
    maxNumberline: number,
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
    if (maxNumberline - minNumberline > 10) iconNumberLineLength = 20;
    if (maxNumberline - minNumberline > 20) iconNumberLineLength = 30;
    return html`
      <icon-hourglass-button
        title="Getallenlijn boogjes spel ${min} tot ${max} ${description}"
        time=${duration}
        shortCode=${shortCode}
      >
        <div style="background-color:${getColorInfo(color).mainColorCode}" class="button">
          <number-line-v2
            min="0"
            max=${iconNumberLineLength}
            tickMarks="upToSingles"
            .belowArches=${belowArches}
            .aboveArches=${aboveArches}
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
    minNumberline: number,
    maxNumberline: number,
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
        minNumberline,
        maxNumberline,
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
        minNumberline,
        maxNumberline,
        arches,
        archesLocation,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const operatorText =
      this.operator === 'plus' ? 'plus sommen' : 'min sommen';
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Getallenlijn boogjes spel met ${operatorText}</h2>`,
    ];
    const sectionsToUse =
      this.operator === 'minus' ? minusSections : plusSections;
    for (const section of sectionsToUse) {
      renderItems.push(
        html`<h3>
          Op een getallenlijn van ${section.minNumberline} tot
          ${section.maxNumberline}
        </h3>`,
      );
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['3min', '5min'],
              row.shortCodes,
              row.min,
              row.max,
              section.minNumberline,
              section.maxNumberline,
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
