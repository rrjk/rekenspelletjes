import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { readableColor } from 'color2k';

import { getColorInfo, type Color, stringToColor } from './Colors';

export const possibleNumberDots = [1, 2, 3, 4, 5, 6] as const;
export type PossibleNumberDots = (typeof possibleNumberDots)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dotPositions = [
  'leftTop',
  'leftMiddle',
  'leftBottom',
  'rightTop',
  'rightMiddle',
  'rightBottom',
  'center',
] as const;
type DotPosition = (typeof dotPositions)[number];

type DotCoordinate = { x: number; y: number };

const dotCoordinates = new Map<DotPosition, DotCoordinate>([
  ['leftTop', { x: 30, y: 30 }],
  ['leftMiddle', { x: 30, y: 50 }],
  ['leftBottom', { x: 30, y: 70 }],
  ['rightTop', { x: 70, y: 30 }],
  ['rightMiddle', { x: 70, y: 50 }],
  ['rightBottom', { x: 70, y: 70 }],
  ['center', { x: 50, y: 50 }],
]);

const numberToDotPositions = new Map<PossibleNumberDots, DotPosition[]>([
  [1, ['center']],
  [2, ['leftTop', 'rightBottom']],
  [3, ['leftTop', 'center', 'rightBottom']],
  [4, ['leftTop', 'leftBottom', 'rightTop', 'rightBottom']],
  [5, ['leftTop', 'leftBottom', 'center', 'rightTop', 'rightBottom']],
  [
    6,
    [
      'leftTop',
      'leftMiddle',
      'leftBottom',
      'rightTop',
      'rightMiddle',
      'rightBottom',
    ],
  ],
]);

/** Function to convert a string into a PossibleBumberDots.
 * If the provided string is undefined, 5 is selected as the number of dots.
 * If the provided string is not a valid number, 6 is selected as the number of dots.
 * If the provided string is to small, 1 is selected as the number of dots.
 * If the provided string is to large, 6  is selected as the number of dots.
 */
function numberToPossibleNumberDots(
  attributeValue: string | null,
): PossibleNumberDots {
  if (attributeValue === null) return 5;
  const nmbr = parseInt(attributeValue, 10);
  if (Number.isNaN(nmbr)) {
    return 6;
  }
  if (nmbr < 1) return 1;
  if (nmbr > 6) return 6;
  return nmbr as PossibleNumberDots; // Due to the if statements above, we can cast to PossibleNumberDots
}

@customElement('die-face')
export class DieFace extends LitElement {
  /** Number of dots to show */
  @property({ converter: numberToPossibleNumberDots })
  accessor numberDots: PossibleNumberDots = 3;
  /** Color of the die face to use */
  @property({ converter: stringToColor })
  accessor dieFaceColor: Color = 'blue';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
        }

        rect.face {
          fill: var(--dieColor);
          stroke: var(--borderColor);
        }

        circle.dot {
          fill: var(--dotColor);
        }
      `,
    ];
  }

  renderDot(dotPosition: DotPosition): SVGTemplateResult {
    const x = dotCoordinates.get(dotPosition)?.x;
    const y = dotCoordinates.get(dotPosition)?.y;

    if (x === undefined || y === undefined)
      throw Error(
        `Internal SW error - No coordinate available for dot position ${dotPosition}`,
      );

    return svg`
    <circle class="dot" cx="${x}" cy="${y}" r="8" />`;
  }

  renderDots(numberDots: PossibleNumberDots): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [];
    const dotPositions = numberToDotPositions.get(numberDots);

    if (dotPositions === undefined)
      throw Error(
        `Internal SW error - No dot positons available for number dots ${numberDots}`,
      );

    for (const position of dotPositions) {
      ret.push(this.renderDot(position));
    }

    return ret;
  }

  render(): HTMLTemplateResult {
    return html`
      <style>
        :host {
          --dieColor: ${getColorInfo(this.dieFaceColor).mainColorCode};
          --dotColor: ${readableColor(
            getColorInfo(this.dieFaceColor).mainColorCode,
          )};
          --borderColor: ${getColorInfo(this.dieFaceColor).accentColorCode};
        }
      </style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          class="face"
          x="10"
          y="10"
          width="80"
          height="80"
          rx="10"
          stroke-width="2"
        />
        ${this.renderDots(this.numberDots)}
      </svg>
    `;
  }
}
