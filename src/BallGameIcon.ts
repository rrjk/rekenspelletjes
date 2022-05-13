import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
export type BallColors = 'blue' | 'red' | 'yellow' | 'green';

/** XY vector  */
interface XYvector {
  x: number;
  y: number;
}

/** All permutations of four ball color */
const ballColorPermutations = [
  ['yellow', 'blue', 'green', 'red'],
  ['yellow', 'blue', 'red', 'green'],
  ['yellow', 'red', 'green', 'blue'],
  ['yellow', 'red', 'blue', 'green'],
  ['yellow', 'green', 'red', 'blue'],
  ['yellow', 'green', 'blue', 'red'],

  ['blue', 'yellow', 'green', 'red'],
  ['blue', 'yellow', 'red', 'green'],
  ['blue', 'red', 'green', 'yellow'],
  ['blue', 'red', 'yellow', 'green'],
  ['blue', 'green', 'red', 'yellow'],
  ['blue', 'green', 'yellow', 'red'],

  ['green', 'blue', 'yellow', 'red'],
  ['green', 'blue', 'red', 'yellow'],
  ['green', 'red', 'yellow', 'blue'],
  ['green', 'red', 'blue', 'yellow'],
  ['green', 'yellow', 'red', 'blue'],
  ['green', 'yellow', 'blue', 'red'],

  ['red', 'blue', 'green', 'yellow'],
  ['red', 'blue', 'yellow', 'green'],
  ['red', 'yellow', 'green', 'blue'],
  ['red', 'yellow', 'blue', 'green'],
  ['red', 'green', 'yellow', 'blue'],
  ['red', 'green', 'blue', 'yellow'],
];

@customElement('ballgame-icon')
export class BalloonIndex extends LitElement {
  /** Color permutation to use, index into ballColorPermutations */
  @property({ type: Number })
  colorPermutation = 0;
  @property({ type: String })
  alt = '';
  @property({ type: String })
  text = '';
  @property({ type: Boolean })
  twoBalls = false;
  @property({ type: Boolean })
  smallFont = false;

  static get styles(): CSSResultGroup {
    return css``;
  }

  render(): HTMLTemplateResult {
    const ballTemplates: SVGTemplateResult[] = [];

    let positions: XYvector[];

    if (!this.twoBalls) {
      positions = [
        { x: 5, y: 5 },
        { x: 86, y: 5 },
        { x: 167, y: 5 },
      ];
    } else {
      positions = [
        { x: 5, y: 5 },
        { x: 167, y: 5 },
      ];
    }

    for (let i = 0; i < positions.length; i++) {
      const ballTemplate = svg`
        <image
          height="78"
          href="../images/ball-${
            ballColorPermutations[this.colorPermutation][i]
          }.svg"
          x="${positions[i].x}"
          y="${positions[i].y}"
        ></image>`;
      ballTemplates.push(ballTemplate);
    }
    const textTemplate = svg`
        <text
          font-size = "${this.smallFont ? 40 : 57}"
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"    
        >${this.text}</text>`;

    return html`
      <svg viewBox="0 0 250 88" style="width: 100%">
        <title>${this.alt}</title>
        <rect
          x="0"
          y="0"
          width="250"
          height="88"
          rx="10"
          ry="10"
          fill="none"
          stroke="black"
          stroke-width="3"
        ></rect>
        ${ballTemplates}${textTemplate}
      </svg>
    `;
  }
}
